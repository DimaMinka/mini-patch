'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PriceDisplay } from '@/components/pricing/PriceDisplay';
import { SubmitOrderButton } from '@/components/pricing/SubmitOrderButton';
import PatchCanvas from '@/components/canvas/PatchCanvas';
import { usePatchStore } from '@/stores/usePatchStore';
import { calculatePrice } from '@/lib/pricing/PriceCalculator';
import type { PatchOrderPayload } from '@/lib/types/patch';
import { EXTERNAL_PAYMENT_URL } from '@/lib/constants';

export default function Home() {
    const [triggerExport, setTriggerExport] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Called when user clicks "Submit Order"
    const handleSubmitClick = () => {
        setIsSubmitting(true);
        setTriggerExport(Date.now());
    };

    // Called by PatchCanvas after generating image
    const handleCanvasExport = async (previewBase64: string) => {
        try {
            const state = usePatchStore.getState();
            const config = {
                shape: state.shape,
                material: state.material,
                size: state.size,
                backgroundColor: state.backgroundColor,
                borderColor: state.borderColor,
                quantity: state.quantity,
                userImageDataUrl: state.userImageDataUrl,
            };

            const price = calculatePrice(config);
            const payload: PatchOrderPayload = {
                config,
                price,
                previewBase64,
                redirectUrl: EXTERNAL_PAYMENT_URL,
            };

            console.log('🚀 Order Submitted:', payload);

            setTimeout(() => {
                alert(`Order for ${config.quantity} patches submitted!\nTotal: $${price.totalPrice}`);
                setIsSubmitting(false);
            }, 800);

        } catch (error) {
            console.error('Submission failed:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] w-full lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden">

            {/* 1. Sidebar (Desktop: Left, Mobile: Second) */}
            <div className="order-2 lg:order-none border-e bg-background flex flex-col h-full min-h-0 relative z-20 overflow-hidden">
                <Sidebar />
            </div>

            {/* 2. Main Canvas Area (Desktop: Center, Mobile: First) */}
            <div className="order-1 lg:order-none flex flex-col items-center justify-center bg-muted/30 relative p-4 min-h-[400px] lg:min-h-0 overflow-hidden">
                <PatchCanvas
                    triggerExport={triggerExport}
                    onExport={handleCanvasExport}
                />
            </div>

            {/* 3. Price Panel (Desktop: Right, Mobile: Bottom) */}
            <div className="order-3 lg:order-none border-s bg-background flex flex-col h-full min-h-0 relative z-20">
                <div className="flex-1 p-6 overflow-auto">
                    <div className="space-y-6">
                        <h2 className="font-semibold text-lg tracking-tight hidden lg:block text-start">Summary</h2>
                        <PriceDisplay />
                    </div>
                </div>
                <div className="p-4 border-t bg-background sticky bottom-0 z-10 shrink-0">
                    <SubmitOrderButton
                        onClick={handleSubmitClick}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>

        </div>
    );
}
