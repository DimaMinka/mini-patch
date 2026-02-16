import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/rag/generateEmbedding';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { query, type, limit = 9 } = await req.json();

        if (type === 'latest') {
            const supabase = createServerClient();
            const { data: patches, error } = await supabase
                .from('patches')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Supabase Latest Patches Error:', error);
                return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
            }
            return NextResponse.json({ results: patches || [] });
        }

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
        }

        console.log(`🔎 Search Query: "${query}"`);

        // 1. Generate Embedding for the query
        const embedding = await generateEmbedding(query);

        // 2. Call Supabase RPC function (match_patches)
        const supabase = createServerClient();

        const { data: patches, error } = await supabase.rpc('match_patches', {
            query_embedding: embedding,
            match_threshold: 0.60, // Tuned higher to avoid broad matches like "Gaza" -> "Police"
            match_count: limit // Use limit for semantic search too
        });

        if (error) {
            console.error('Supabase Search Error:', error);
            return NextResponse.json({ error: 'Database search failed' }, { status: 500 });
        }

        console.log(`✅ Found ${patches?.length || 0} matches`);
        return NextResponse.json({ results: patches || [] });

    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
