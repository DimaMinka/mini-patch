import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PatchShape, PatchMaterial, PatchSize, PatchConfig } from '@/lib/types/patch';
import {
    DEFAULT_SHAPE,
    DEFAULT_MATERIAL,
    DEFAULT_SIZE,
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_BORDER_COLOR,
    DEFAULT_QUANTITY,
    MAX_QUANTITY,
} from '@/lib/constants';

interface PatchStore extends PatchConfig {
    // UI state
    dir: 'ltr' | 'rtl';
    locale: 'en' | 'ru' | 'he';

    // Setters
    setShape: (shape: PatchShape) => void;
    setMaterial: (material: PatchMaterial) => void;
    setSize: (size: PatchSize) => void;
    setBackgroundColor: (color: string) => void;
    setBorderColor: (color: string) => void;
    setQuantity: (qty: number) => void;
    setUserImage: (dataUrl: string | null) => void;
    setLocale: (locale: 'en' | 'ru' | 'he') => void;

    // External triggers (e.g. from Menu)
    chatAction: string | null;
    setChatAction: (action: string | null) => void;

    reset: () => void;
}

const DEFAULT_CONFIG: PatchConfig = {
    shape: DEFAULT_SHAPE,
    material: DEFAULT_MATERIAL,
    size: DEFAULT_SIZE,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    borderColor: DEFAULT_BORDER_COLOR,
    quantity: DEFAULT_QUANTITY,
    userImageDataUrl: null,
};

export const usePatchStore = create<PatchStore>()(
    persist(
        (set) => ({
            ...DEFAULT_CONFIG,
            dir: 'ltr',
            locale: 'en',

            setShape: (shape) => set({ shape }),
            setMaterial: (material) => set({ material }),
            setSize: (size) => set({ size }),
            setBackgroundColor: (color) => set({ backgroundColor: color }),
            setBorderColor: (color) => set({ borderColor: color }),
            setQuantity: (qty) => set({ quantity: Math.min(MAX_QUANTITY, Math.max(1, qty)) }),
            setUserImage: (dataUrl) => set({ userImageDataUrl: dataUrl }),
            setLocale: (locale) => set({ locale, dir: locale === 'he' ? 'rtl' : 'ltr' }),

            chatAction: null,
            setChatAction: (action) => set({ chatAction: action }),

            reset: () => set({ ...DEFAULT_CONFIG, dir: 'ltr', locale: 'en' }),
        }),
        {
            name: 'patch-builder-storage',
            partialize: (state) => {
                const { chatAction, setChatAction, ...rest } = state;
                return rest;
            }
        }
    )
);
