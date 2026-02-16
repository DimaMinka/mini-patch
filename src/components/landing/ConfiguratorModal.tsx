'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PriceDisplay } from '@/components/pricing/PriceDisplay';
import { SubmitOrderButton } from '@/components/pricing/SubmitOrderButton';
import PatchCanvas from '@/components/canvas/PatchCanvas';
import { useTranslations, useFormatter } from 'next-intl';
import { usePatchStore } from '@/stores/usePatchStore';
import { calculatePrice } from '@/lib/pricing/PriceCalculator';
import type { PatchOrderPayload } from '@/lib/types/patch';
import { EXTERNAL_PAYMENT_URL } from '@/lib/constants';

interface ConfiguratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConfiguratorModal = ({ isOpen, onClose }: ConfiguratorModalProps) => {
    const t = useTranslations('modal');
    const tPricing = useTranslations('pricing'); // for alert summary
    const format = useFormatter();
    const [triggerExport, setTriggerExport] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Called when user clicks "Submit Order" inside modal
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
                const formattedTotal = format.number(price.totalPrice, { style: 'currency', currency: 'USD' });
                // Use a proper toast or custom alert in future; reuse alert logic for now
                alert(`Order for ${config.quantity} patches submitted!\nTotal: ${formattedTotal}`);
                setIsSubmitting(false);
                onClose(); // Optional: close modal on success
            }, 800);

        } catch (error) {
            console.error('Submission failed:', error);
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full h-full bg-background flex flex-col md:overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-card z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow-sm">🦎</span>
                        <h2 className="text-xl font-bold">{t('title')}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Configurator Layout (3-Column Grid reused) */}
                <div className="flex-1 overflow-auto md:overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] h-full">

                        {/* 1. Sidebar (Desktop: Left, Mobile: Second) */}
                        <div className="order-2 lg:order-none border-e bg-background flex flex-col lg:h-full lg:overflow-hidden relative z-20">
                            <Sidebar />
                        </div>

                        {/* 2. Main Canvas Area (Desktop: Center, Mobile: First) */}
                        <div className="order-1 lg:order-none flex flex-col items-center justify-center bg-muted/30 relative p-4 min-h-[400px] lg:min-h-0 md:h-full">
                            <PatchCanvas
                                triggerExport={triggerExport}
                                onExport={handleCanvasExport}
                            />
                        </div>

                        {/* 3. Price Panel (Desktop: Right, Mobile: Bottom) */}
                        <div className="order-3 lg:order-none border-s bg-background flex flex-col lg:h-full lg:min-h-0 relative z-20">
                            <div className="flex-1 p-6 lg:overflow-auto">
                                <div className="space-y-6">
                                    <h2 className="font-semibold text-lg tracking-tight hidden lg:block text-start">{tPricing('summary')}</h2>
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
                </div>
            </div>
        </div>
    );
};
