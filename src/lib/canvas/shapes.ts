import { FabricObject, Path, Rect, Circle } from 'fabric';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';

// Standard Shield Path (normalized 0-1 approximate, scaled to fit)
const SHIELD_PATH_DATA = 'M 250 50 C 250 50 450 50 450 150 C 450 350 250 450 250 450 C 250 450 50 350 50 150 C 50 50 250 50 250 50 Z';

interface ShapeOptions {
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    absolutePosition?: boolean; // if true, uses 500x500 center; if false, relative
}

export const createShieldShape = (opts: ShapeOptions): FabricObject => {
    // We use a fixed path and scale it to fit the requested width/height
    const path = new Path(SHIELD_PATH_DATA);

    // Reset path to origin 0,0 first to scale correctly
    // path.set({ left: 0, top: 0, originX: 'left', originY: 'top' });
    // logic: get bounding box, calculate scale X/Y to match opts.width/height

    const bbox = path.getBoundingRect();
    const scaleX = opts.width / bbox.width;
    const scaleY = opts.height / bbox.height;

    path.set({
        scaleX,
        scaleY,
        fill: opts.fill,
        stroke: opts.stroke,
        strokeWidth: opts.strokeWidth ?? 0,
        originX: 'center',
        originY: 'center',
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        selectable: false,
        evented: false,
    });

    return path;
};

export const createRectShape = (opts: ShapeOptions): FabricObject => {
    return new Rect({
        width: opts.width,
        height: opts.height,
        fill: opts.fill,
        stroke: opts.stroke,
        strokeWidth: opts.strokeWidth ?? 0,
        originX: 'center',
        originY: 'center',
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        selectable: false,
        evented: false,
        rx: 10, // constant corner radius for now
        ry: 10,
    });
};

export const createCircleShape = (opts: ShapeOptions): FabricObject => {
    // uses width as diameter
    return new Circle({
        radius: opts.width / 2,
        fill: opts.fill,
        stroke: opts.stroke,
        strokeWidth: opts.strokeWidth ?? 0,
        originX: 'center',
        originY: 'center',
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        selectable: false,
        evented: false,
    });
};
