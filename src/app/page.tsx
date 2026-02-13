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
        // Trigger canvas to export base64 image
        // The canvas component will respond by calling onExport
        setTriggerExport(Date.now());
    };

    // Called by PatchCanvas after generating image
    const handleCanvasExport = async (previewBase64: string) => {
        try {
            // 1. Get current state snapshot
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

            // 2. Calculate final price
            const price = calculatePrice(config);

            // 3. Build payload
            const payload: PatchOrderPayload = {
                config,
                price,
                previewBase64,
                redirectUrl: EXTERNAL_PAYMENT_URL,
            };

            console.log('🚀 Order Submitted:', payload);
            console.log('Base64 Preview Length:', previewBase64.length);

            // 4. Simulate API call / Redirect
            // await submitOrder(payload);

            // MVP: Alert user (since we don't have real endpoint yet)
            setTimeout(() => {
                alert(`Order for ${config.quantity} patches submitted!\nTotal: $${price.totalPrice}\n(See console for payload)`);
                setIsSubmitting(false);
            }, 800);

        } catch (error) {
            console.error('Submission failed:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_300px] lg:h-[calc(100vh-3.5rem)]">

            {/* Sidebar (Desktop: Left Col, Mobile: Order 2) */}
            <div className="order-2 lg:order-1 border-e bg-background">
                <Sidebar />
            </div>

            {/* Main Canvas Area (Desktop: Center, Mobile: Order 1) */}
            <div className="order-1 lg:order-2 flex flex-col items-center justify-center bg-muted/30 relative overflow-hidden p-4 min-h-[400px] lg:min-h-0">
                <PatchCanvas
                    triggerExport={triggerExport}
                    onExport={handleCanvasExport}
                />
            </div>

            {/* Price Panel (Desktop: Right Col, Mobile: Order 3 Sticky?) */}
            <div className="order-3 lg:order-3 border-s bg-background flex flex-col">
                <div className="flex-1 p-6 lg:overflow-auto">
                    <div className="space-y-6">
                        <h2 className="font-semibold text-lg tracking-tight hidden lg:block">Summary</h2>
                        <PriceDisplay />
                    </div>
                </div>
                <div className="p-4 border-t bg-background sticky bottom-0 z-10">
                    <SubmitOrderButton
                        onClick={handleSubmitClick}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>

        </div>
    );
}
