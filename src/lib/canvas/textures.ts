import { FabricImage } from 'fabric';
import { TEXTURE_MAP } from '@/lib/constants';
import type { PatchMaterial } from '@/lib/types/patch';

/**
 * Loads a texture image for the given material.
 * Applies 'multiply' blending for realistic overlay on background color.
 */
export async function loadTextureImage(material: PatchMaterial): Promise<FabricImage> {
    const textureInfo = TEXTURE_MAP[material];

    try {
        const img = await FabricImage.fromURL(textureInfo.src);

        // Configure for overlay
        img.set({
            originX: 'center',
            originY: 'center',
            left: 250, // center of 500px canvas
            top: 250,
            scaleX: 1, // assume texture is 500x500 prepared
            scaleY: 1,
            opacity: textureInfo.opacity,
            globalCompositeOperation: 'multiply',
            selectable: false,
            evented: false,
            excludeFromExport: false, // keep in export
        });

        return img;
    } catch (error) {
        console.error(`Failed to load texture for ${material}`, error);
        // Return empty transparent image as fallback to prevent crash
        return await FabricImage.fromURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
}
