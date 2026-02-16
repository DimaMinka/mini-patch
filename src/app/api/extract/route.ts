import { NextRequest, NextResponse } from 'next/server';
import { extractPatchMetadata } from '@/lib/rag/extractMetadata';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { id, description } = await req.json();

        if (!id || !description) {
            return NextResponse.json({ error: 'Missing id or description' }, { status: 400 });
        }

        // 1. Run AI Extraction
        const metadata = await extractPatchMetadata(description);

        // 2. Update DB with metadata
        const supabase = createServerClient();
        const { error } = await supabase
            .from('patches')
            .update({ metadata })
            .eq('id', id);

        if (error) {
            console.error('Failed to update metadata:', error);
            // We return the metadata anyway so the UI can show it
        }

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Extraction Error:', error);
        return NextResponse.json({ error: 'Failed to extract metadata' }, { status: 500 });
    }
}
