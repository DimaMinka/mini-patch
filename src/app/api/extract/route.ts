import { NextRequest, NextResponse } from 'next/server';
import { extractPatchMetadata } from '@/lib/rag/extractMetadata';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    // Check Password
    const password = req.headers.get('x-upload-password');
    if (password !== process.env.UPLOAD_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, description } = await req.json();
        if (!id || !description) {
            return NextResponse.json({ error: 'Missing id or description' }, { status: 400 });
        }

        console.log(`Extracting for ID: ${id}`);

        // 1. Run AI Extraction
        const metadata = await extractPatchMetadata(description);
        console.log('AI Extraction successful');

        // 2. Update DB with metadata
        const supabase = createServerClient();
        console.log('Updating record with metadata...');
        const { error: dbError } = await supabase
            .from('patches')
            .update({ metadata })
            .eq('id', id);

        if (dbError) {
            console.error('Extraction update error:', dbError);
            // Return metadata anyway so UI works, but log the error
        }

        console.log('Extraction sequence complete');
        return NextResponse.json(metadata);
    } catch (error: any) {
        console.error('CRITICAL Extraction Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
