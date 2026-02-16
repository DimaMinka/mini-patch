import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import type { PatchMetadata } from '@/lib/types/patch';

const patchMetadataSchema = z.object({
  category: z.enum(['military', 'medical', 'police', 'fire', 'school', 'security', 'other'])
    .describe('Primary domain of the patch'),
  organization: z.string().nullable()
    .describe('Top-level entity in English, e.g. "IDF", "Border Police", "Magen David Adom"'),
  unit: z.string().nullable()
    .describe('Numeric unit/brigade identifier, e.g. "810", "16". null if absent'),
  battalion: z.string().nullable()
    .describe('Numeric battalion/regiment identifier, e.g. "1810", "8119". null if absent'),
  unit_name: z.string().nullable()
    .describe('Translated unit name in English, e.g. "Nahal", "Golani", "Mount Hermon Brigade"'),
  shape: z.string().nullable()
    .describe('Physical shape: round | shield | rectangle | custom. null if unknown'),
  colors: z.array(z.string())
    .describe('All dominant colors translated to English lowercase, e.g. ["green","black"]'),
  features: z.array(z.string())
    .describe('Visual elements, materials, symbols translated to English, e.g. ["embroidery","star of david"]'),
  search_content: z.string()
    .describe('Lowercase space-separated index of ALL keywords: category, org, numbers, names, colors, features, locations'),
});

export async function extractPatchMetadata(description: string): Promise<PatchMetadata> {
  const { object } = await generateObject({
    model: google('gemini-2.0-flash'),
    schema: patchMetadataSchema,
    prompt: description,
    system: `Extract structured metadata from a patch/emblem description. Input may be in Hebrew, Russian, or English. All output fields must be in English.

Key rules:
- Translate colors, shapes, and features to English.
- Preserve all numbers (unit, battalion) exactly as given.
- search_content must contain every extracted keyword, number, and location name in lowercase for full-text search.

Example:
Input: "חטיבה 810 גדוד 1810 צה״ל ירוק רקמה שחור הר חרמון"
→ category:"military", organization:"IDF", unit:"810", battalion:"1810", unit_name:"Mount Hermon Brigade", colors:["green","black"], features:["embroidery","mount hermon"], search_content:"military idf 810 1810 mount hermon brigade green black embroidery"`,
  });

  return object;
}
