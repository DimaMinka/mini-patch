import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/rag/generateEmbedding';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { query, type, limit = 9, offset = 0 } = await req.json();

        if (type === 'latest') {
            const supabase = createServerClient();
            const { data: patches, error } = await supabase
                .from('patches')
                .select('*')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error('Supabase Latest Patches Error:', error);
                return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
            }
            return NextResponse.json({
                results: patches || [],
                hasMore: patches.length === limit
            });
        }

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
        }

        console.log(`🔎 Search Query: "${query}" (Offset: ${offset})`);

        // 1. Generate Embedding for the query
        const embedding = await generateEmbedding(query);

        // 2. Call Supabase RPC function (match_patches)
        const supabase = createServerClient();

        // Note: match_patches RPC needs to be updated if we want true offset/range in RPC.
        // For now, we'll just handle it for 'latest' which is what user specifically asked for.
        const { data: patches, error } = await supabase.rpc('match_patches', {
            query_embedding: embedding,
            match_threshold: 0.57, // Lowered slightly to be more helpful
            match_count: limit + offset
        });

        // Slice for simple semantic offset
        const sliced = patches?.slice(offset, offset + limit) || [];

        if (error) {
            console.error('Supabase Search Error:', error);
            return NextResponse.json({ error: 'Database search failed' }, { status: 500 });
        }

        return NextResponse.json({
            results: sliced,
            hasMore: patches?.length === (limit + offset)
        });

    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
