'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from 'fabric';
import { usePatchStore } from '@/stores/usePatchStore';
import { updateCanvas } from '@/lib/canvas/layers';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';

interface PatchCanvasProps {
    triggerExport?: number;
    onExport?: (dataUrl: string) => void;
}

const PatchCanvasInner = ({ triggerExport, onExport }: PatchCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);

    // Connect to store
    // Connect to store - select individually to avoid re-renders on quantity change
    const shape = usePatchStore((state) => state.shape);
    const material = usePatchStore((state) => state.material);
    const size = usePatchStore((state) => state.size);
    const backgroundColor = usePatchStore((state) => state.backgroundColor);
    const borderColor = usePatchStore((state) => state.borderColor);
    const userImageDataUrl = usePatchStore((state) => state.userImageDataUrl);

    // 1. Initialize Fabric Canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        // Dispose old instance if exists (React StrictMode double-mount)
        if (fabricRef.current) {
            fabricRef.current.dispose();
        }

        const canvas = new Canvas(canvasRef.current, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundColor: '#f3f4f6', // Workspace background
            selection: false, // Disable group selection by drag
            preserveObjectStacking: true,
            allowTouchScrolling: true, // Fix mobile scrolling blocking
        });

        fabricRef.current = canvas;

        // Initial render
        updateCanvas(canvas, {
            shape, material, size, backgroundColor, borderColor,
            quantity: 1,
            userImageDataUrl
        });

        // Cleanup
        return () => {
            canvas.dispose();
            fabricRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // 2. React to config changes
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        // Update the canvas content
        // We pass the *entire* config, layer orchestrator handles diffing/rebuilding
        updateCanvas(canvas, {
            shape, material, size, backgroundColor, borderColor,
            quantity: 1, // Quantity doesn't affect visual
            userImageDataUrl
        });

    }, [shape, material, size, backgroundColor, borderColor, userImageDataUrl]); // Re-run only on visual changes

    // 3. Handle Export Trigger
    useEffect(() => {
        if (triggerExport && onExport && fabricRef.current) {
            // High-res export (multiplier 2x = 1000x1000px)
            const dataUrl = fabricRef.current.toDataURL({ format: 'png', multiplier: 2, enableRetinaScaling: true });
            onExport(dataUrl);
        }
    }, [triggerExport, onExport]);

    return (
        <div className="relative w-full max-w-[500px] mx-auto aspect-square bg-gray-100 rounded-lg shadow-sm overflow-hidden border border-border">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

// Export dynamic component to avoid SSR issues with Fabric.js
export default dynamic(() => Promise.resolve(PatchCanvasInner), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[500px] mx-auto aspect-square bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">
            Loading Canvas...
        </div>
    )
});
