import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { z } from 'zod';

export async function POST(req: NextRequest) {
    console.log('API: /api/upload hit');
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const description = formData.get('description') as string;

        if (!file || !description) {
            return NextResponse.json({ error: 'Missing file or description' }, { status: 400 });
        }

        const supabase = createServerClient();

        // 1. Upload Image to Storage 'patches' bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('patches')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('patches')
            .getPublicUrl(filePath);

        // 2. Insert Record into DB
        const { data: record, error: dbError } = await supabase
            .from('patches')
            .insert({
                image_path: filePath,
                image_url: publicUrl,
                description: description,
            })
            .select()
            .single();

        if (dbError) {
            console.error('DB error:', dbError);
            return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
        }

        return NextResponse.json({ id: record.id, image_url: publicUrl });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
