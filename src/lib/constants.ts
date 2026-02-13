import type { PatchMaterial, PatchSize } from '@/lib/types/patch';

// ── Canvas ──────────────────────────────────────────
export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

// ── Pricing ─────────────────────────────────────────
export const BASE_PRICE_PER_CM2 = 0.15; // USD
export const LARGE_AREA_THRESHOLD = 50; // cm²
export const LARGE_AREA_MULTIPLIER = 1.2;

export const MATERIAL_MULTIPLIERS: Record<PatchMaterial, number> = {
    cordura: 1.0,
    pvc: 1.3,
    embroidery: 1.8,
};

export const QUANTITY_DISCOUNT_TIERS = [
    { minQty: 100, discount: 0.25 },
    { minQty: 50, discount: 0.15 },
    { minQty: 25, discount: 0.10 },
    { minQty: 10, discount: 0.05 },
] as const;

// ── Size Presets ────────────────────────────────────
export const SIZE_PRESETS: Record<string, PatchSize> = {
    S: { width: 5, height: 3, label: '5×3 cm' },
    M: { width: 8, height: 5, label: '8×5 cm' },
    Circle: { width: 9, height: 9, label: '⌀9 cm' },
    L: { width: 10, height: 8, label: '10×8 cm' },
    XL: { width: 12, height: 10, label: '12×10 cm' },
};

// ── Materials & Textures ────────────────────────────
export const TEXTURE_MAP: Record<PatchMaterial, { src: string; opacity: number; label: string }> = {
    cordura: { src: '/textures/cordura-1000d.png', opacity: 0.6, label: 'Cordura 1000D' },
    pvc: { src: '/textures/pvc.png', opacity: 0.4, label: 'PVC Rubber' },
    embroidery: { src: '/textures/embroidery.png', opacity: 0.5, label: 'Embroidery' },
};

// ── Defaults ────────────────────────────────────────
export const DEFAULT_BACKGROUND_COLOR = '#2D5A27';
export const DEFAULT_BORDER_COLOR = '#1A1A1A';
export const DEFAULT_QUANTITY = 10;
export const DEFAULT_SHAPE = 'shield' as const;
export const DEFAULT_MATERIAL = 'cordura' as const;
export const DEFAULT_SIZE = SIZE_PRESETS.M;

// ── RAG / Token Optimization ────────────────────────
export const RAG_MAX_CONTEXT_CHUNKS = 3;
export const RAG_SIMILARITY_THRESHOLD = 0.72;
export const RAG_MAX_HISTORY_MESSAGES = 6;
export const RAG_MAX_RESPONSE_TOKENS = 400;
export const RAG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

// ── Theme ───────────────────────────────────────────
export const DEFAULT_THEME: 'light' | 'dark' = 'light';
