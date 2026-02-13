import { Canvas, FabricImage, InteractiveFabricObject, FabricObject } from 'fabric';
import { createShieldShape, createRectShape, createCircleShape } from './shapes';
import { loadTextureImage } from './textures';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import type { PatchConfig } from '@/lib/types/patch';

const PADDING = 60; // Space around the patch
const MAX_DRAW_SIZE = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) - (PADDING * 2);

function getScaleFactor(widthCm: number, heightCm: number): number {
    // Scale so the largest dimension fits in MAX_DRAW_SIZE
    // This means the patch always fills the view, regardless of real size.
    // Real size is just data for manufacturing/price.
    const maxDim = Math.max(widthCm, heightCm);
    return MAX_DRAW_SIZE / maxDim;
}

function getShape(config: PatchConfig, pxWidth: number, pxHeight: number, isBorder = false): FabricObject {
    const opts = {
        width: pxWidth,
        height: pxHeight,
        fill: isBorder ? 'transparent' : config.backgroundColor,
        stroke: isBorder ? config.borderColor : 'transparent',
        strokeWidth: isBorder ? 6 : 0, // border thickness
    };

    switch (config.shape) {
        case 'shield': return createShieldShape(opts);
        case 'circle': return createCircleShape({ ...opts, width: Math.max(pxWidth, pxHeight) }); // simple circle
        case 'rectangle': return createRectShape(opts);
        case 'custom': return createShieldShape(opts); // fallback
        default: return createShieldShape(opts);
    }
}

export async function updateCanvas(canvas: Canvas, config: PatchConfig) {
    // 1. Calculate dimensions in pixels
    const scale = getScaleFactor(config.size.width, config.size.height);
    const pxWidth = config.size.width * scale;
    const pxHeight = config.size.height * scale;

    // 2. Preserve existing user image state (if any)
    // We identify it by a custom property or type
    const existingUserImage = canvas.getObjects().find(o => (o as any).id === 'user-image') as FabricImage | undefined;

    let userImageState = null;
    if (existingUserImage && existingUserImage.getSrc() === config.userImageDataUrl) {
        // If exact same image source, keep its transform
        userImageState = {
            matrix: existingUserImage.calcTransformMatrix(), // or get('matrix')? v6 uses getObjectScaling etc.
            // simpler: just clone props
            scaleX: existingUserImage.scaleX,
            scaleY: existingUserImage.scaleY,
            left: existingUserImage.left,
            top: existingUserImage.top,
            angle: existingUserImage.angle,
        };
    }

    // 3. Clear and rebuild
    canvas.clear();
    canvas.backgroundColor = '#f3f4f6'; // Light gray workspace background (not patch bg)

    // 4. Create Background Shape (Color)
    const bgShape = getShape(config, pxWidth, pxHeight, false);
    canvas.add(bgShape);

    // 5. Set ClipPath (Clone of shape)
    // We need to clone it because the object itself can't be both on canvas and used as clipPath effectively in all cases? 
    // Actually, in v6 assigning an object to clipPath removes it from rendering context usually?
    // We want the clipPath to apply to the *entire canvas* or specific layers?
    // Plan says: "Clone shape → set as canvas.clipPath".
    // This clips the entire 500x500 area to the patch shape.
    // Which handles masking the user image and texture automatically.

    // Fabric v6 clipPath is an object.
    // We must clone appropriately.
    // Note: bgShape is already centered.
    const clipPath = await bgShape.clone();
    clipPath.canvas = canvas; // bind to canvas
    canvas.clipPath = clipPath;

    // 6. Add Texture (Multiply Overlay)
    const texture = await loadTextureImage(config.material);
    // Scale texture to cover canvas? 
    // Texture loader returns 500x500 centered image.
    // It will be clipped by clipPath.
    canvas.add(texture);

    // 7. Add User Image
    if (config.userImageDataUrl) {
        let imgObj: FabricImage;

        if (userImageState && existingUserImage) {
            // Restore logic would go here, but since we cleared, we need to create new or re-add
            // Re-adding the old object instance might be unsafe if it was disposed.
            // Safest is to load new and apply props.
            imgObj = await FabricImage.fromURL(config.userImageDataUrl);
            imgObj.set(userImageState);
        } else {
            // New load
            imgObj = await FabricImage.fromURL(config.userImageDataUrl);
            // Center and fit nicely within patch?
            // Scale to fit half the patch width for starters
            const imgScale = (pxWidth * 0.5) / (imgObj.width || 100);
            imgObj.set({
                originX: 'center',
                originY: 'center',
                left: CANVAS_WIDTH / 2,
                top: CANVAS_HEIGHT / 2,
                scaleX: imgScale,
                scaleY: imgScale,
            });
        }

        imgObj.set({
            id: 'user-image',
            cornerColor: '#FFF',
            cornerStrokeColor: '#000',
            borderColor: '#000',
            cornerStyle: 'circle',
            transparentCorners: false,
        } as any);

        canvas.add(imgObj);
        canvas.setActiveObject(imgObj); // Select it for user convenience
    }

    // 8. Add Border (Stroke only)
    // Must be Added LAST to be on top of image/texture
    // But wait, if we set canvas.clipPath, the border is ALSO clipped?
    // Generally, stroke is centered on path. Half stroke oustide, half inside.
    // If we clip at the exact path boundary, we lose the outer half of the stroke.
    // To fix this:
    // Option A: Inset the clip path by strokeWidth/2.
    // Option B: Don't use canvas.clipPath. Use Group with clipPath?
    // Option C: Clip only the "content" (texture, user image, bg color), but draw border *after* clipping?
    // Fabric canvas.clipPath clips *everything* drawn.
    // If we want border visible on top unclipped (or fully visible), we might need `absolutePositioned` clipPath?

    // Better approach for MVP:
    // Layer 0: BG Color (masked)
    // Layer 1: Texture (masked)
    // Layer 2: User Image (masked)
    // Layer 3: Border (NOT masked?) -> impossible if canvas.clipPath is set.

    // FIX: Don't set `canvas.clipPath`.
    // Instead, set `clipPath` property on the `texture` and `userImage` objects individually?
    // Or put BG+Texture+Image in a Group and clip the Group.
    // Or simply accept that border is clipped (half width). If we double stroke width, we get desired visual width inside?
    // Let's go with "clip everything" for simplicity and consistency.
    // We'll increase stroke width slightly if needed.

    const borderShape = getShape(config, pxWidth, pxHeight, true);
    borderShape.set({
        evented: false,
        selectable: false,
        stroke: config.borderColor,
        strokeWidth: 8 // thicker to account for clipping
    });
    canvas.add(borderShape);

    canvas.requestRenderAll();
}
