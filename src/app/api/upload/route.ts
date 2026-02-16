import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { z } from 'zod';

export async function POST(req: NextRequest) {
    console.log('API: /api/upload hit');

    // Check Password
    const password = req.headers.get('x-upload-password');
    console.log(`Password check: received="${password}", expected="${process.env.UPLOAD_PASSWORD ? 'Set' : 'MISSING'}"`);
    if (password !== process.env.UPLOAD_PASSWORD) {
        console.warn('Unauthorized upload attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const description = formData.get('description') as string;

        console.log(`Payload: file=${file?.name || 'MISSING'}, desc=${description?.substring(0, 10) || 'MISSING'}`);

        if (!file || !description) {
            console.error('Missing file or description in payload');
            return NextResponse.json({ error: 'Missing file or description' }, { status: 400 });
        }

        const supabase = createServerClient();
        console.log('Supabase client created');

        // 1. Upload Image to Storage 'patches' bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log(`Uploading to storage: ${filePath}`);
        const { error: uploadError } = await supabase.storage
            .from('patches')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('patches')
            .getPublicUrl(filePath);

        console.log(`Image URL: ${publicUrl}`);

        // 2. Insert Record into DB
        console.log('Inserting into database...');
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
            console.error('Database insert error:', dbError);
            return NextResponse.json({ error: `DB failed: ${dbError.message}` }, { status: 500 });
        }

        console.log(`Success! Fixed record ID: ${record.id}`);
        return NextResponse.json({ id: record.id, image_url: publicUrl });
    } catch (error: any) {
        console.error('CRITICAL API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
