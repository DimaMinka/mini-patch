import { google } from '@ai-sdk/google';
import { embed } from 'ai';

// In-memory cache to prevent redundant API calls for same queries
const globalForCache = global as unknown as { embeddingCache?: Map<string, number[]> };
const embeddingCache = globalForCache.embeddingCache || new Map();
if (process.env.NODE_ENV !== 'production') globalForCache.embeddingCache = embeddingCache;

/**
 * Generates a vector embedding for the given text using the Gemini gemini-embedding-001 model.
 * Resulting vector has 3072 dimensions.
 * Includes in-memory caching for performance.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const normalizedText = text.trim().toLowerCase();

    // 1. Check Cache
    if (embeddingCache.has(normalizedText)) {
        console.log('⚡ Using cached embedding for:', normalizedText);
        return embeddingCache.get(normalizedText)!;
    }

    try {
        const { embedding } = await embed({
            model: google.textEmbeddingModel('gemini-embedding-001'),
            value: text.replace(/\n/g, ' '), // Normalize newlines
        });

        // 2. Save to Cache (Simple LRU-like: clear if too big)
        if (embeddingCache.size > 1000) {
            embeddingCache.clear();
        }
        embeddingCache.set(normalizedText, embedding);

        return embedding;
    } catch (error) {
        console.error('Embedding generation failed:', error);
        throw error;
    }
}
