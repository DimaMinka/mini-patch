import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import type { PatchMetadata } from '@/lib/types/patch';

const patchMetadataSchema = z.object({
    category: z.enum(['military', 'medical', 'police', 'fire', 'school', 'security', 'other']),
    organization: z.string().nullable().describe('Name of the organization, e.g. "Ichilov Hospital", "Border Police"'),
    unit: z.string().nullable().describe('Unit number (e.g. "16") - only for military/police'),
    battalion: z.string().nullable().describe('Battalion number (e.g. "8119") - only for military'),
    unit_name: z.string().nullable().describe('Name of the unit (e.g. "Nahal", "Golani")'),
    shape: z.string().nullable().describe('Physical shape (round, shield, rectangle, custom)'),
    colors: z.array(z.string()).describe('Dominant colors in English (e.g. "green", "black")'),
    features: z.array(z.string()).describe('Visual features, materials, or text (e.g. "black thread", "star of david")'),
    search_content: z.string().describe('Normalized space-separated string of all attributes for embedding'),
});

export async function extractPatchMetadata(description: string): Promise<PatchMetadata> {
    const { object } = await generateObject({
        model: google('gemini-2.0-flash'),
        schema: patchMetadataSchema,
        prompt: description,
        system: `You are a specialized military and organizational analyst. 
        Analyze the following text description of a patch/emblem (likely in Russian) and extract structured metadata.
        
        Output in English. Translate all descriptive fields (colors, shapes, features) to English.
        
        Rules:
        1. Determine the category: military, medical, police, fire, school, security, or other.
        2. Extract specific hierarchy details (unit, battalion) ONLY if applicable (mostly military).
        3. 'organization' should capture the high-level entity (e.g., "Magen David Adom", "Haifa Fire Dept").
        4. 'search_content' must be a single lowercase string containing all extracted keywords for search indexing.
        
        Examples:
        
        Input: "круглая, зеленая, черная нить, сложный принт, армия, бригада 16, батальон 8119, нахаль"
        Output: {
          category: "military",
          organization: "IDF",
          unit: "16",
          battalion: "8119",
          unit_name: "Nahal",
          shape: "round",
          colors: ["green", "black"],
          features: ["complex print", "black thread"],
          search_content: "military idf nahal brigade 16 battalion 8119 round green black complex print"
        }
        
        Input: "белая, прямоугольная, красная звезда, скорая помощь, маген давид адом"
        Output: {
          category: "medical",
          organization: "Magen David Adom",
          unit: null,
          battalion: null,
          unit_name: null,
          shape: "rectangle",
          colors: ["white", "red"],
          features: ["red star", "ambulance"],
          search_content: "medical magen david adom ambulance rectangle white red star"
        }

        Input: "синяя, щит, полиция, пограничная охрана, магав"
        Output: {
          category: "police",
          organization: "Border Police",
          unit: null,
          battalion: null,
          unit_name: "Magav",
          shape: "shield",
          colors: ["blue"],
          features: ["border guard"],
          search_content: "police border police magav shield blue border guard"
        }
        `,
    });

    return object;
}
