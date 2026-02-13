import { FabricImage, Pattern, Rect, FabricObject } from 'fabric';
import { TEXTURE_MAP } from '@/lib/constants';
import type { PatchMaterial } from '@/lib/types/patch';

/**
 * Loads a texture image for the given material and creates a tiled pattern.
 * Applies 'multiply' blending for realistic overlay on background color.
 */
export async function loadTextureImage(material: PatchMaterial): Promise<FabricObject> {
    const textureInfo = TEXTURE_MAP[material];

    try {
        const img = await FabricImage.fromURL(textureInfo.src);

        // Create a pattern from the image
        // We scale the pattern down to make it look less zoomed in
        const patternScale = 0.18;
        const pattern = new Pattern({
            source: img.getElement() as HTMLImageElement,
            repeat: 'repeat',
            // Pattern transform to scale the texture
            patternTransform: [patternScale, 0, 0, patternScale, 0, 0]
        });

        // Create a rectangle that covers the entire canvas (500x500)
        // This rectangle will be filled with the tiled pattern
        const textureRect = new Rect({
            width: 500,
            height: 500,
            left: 0,
            top: 0,
            fill: pattern,
            opacity: textureInfo.opacity,
            globalCompositeOperation: 'multiply',
            selectable: false,
            evented: false,
            excludeFromExport: false,
        });

        return textureRect;
    } catch (error) {
        console.error(`Failed to load texture for ${material}`, error);
        // Return a simple transparent rect as fallback
        return new Rect({
            width: 500,
            height: 500,
            fill: 'transparent',
            selectable: false,
            evented: false
        });
    }
}
