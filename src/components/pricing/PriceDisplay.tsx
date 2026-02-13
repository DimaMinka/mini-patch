import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePatchStore } from '@/stores/usePatchStore';
import { calculatePrice } from '@/lib/pricing/PriceCalculator';

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const PriceDisplay = () => {
    // Select config needed for calculation individually to avoid infinite re-renders/loops
    const shape = usePatchStore((state) => state.shape);
    const material = usePatchStore((state) => state.material);
    const size = usePatchStore((state) => state.size);
    const backgroundColor = usePatchStore((state) => state.backgroundColor);
    const borderColor = usePatchStore((state) => state.borderColor);
    const quantity = usePatchStore((state) => state.quantity);
    const userImageDataUrl = usePatchStore((state) => state.userImageDataUrl);

    const setQuantity = usePatchStore((state) => state.setQuantity);

    const config = { shape, material, size, backgroundColor, borderColor, quantity, userImageDataUrl };
    const breakdown = calculatePrice(config);

    return (
        <div className="bg-card border-t p-4 lg:p-6 shadow-up lg:shadow-none lg:border-s lg:border-t-0 space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(config.quantity - 1)}
                        disabled={config.quantity <= 1}
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                        type="number"
                        min={1}
                        value={config.quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center px-1"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(config.quantity + 1)}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unit Price</span>
                    <span>{formatCurrency(breakdown.unitPrice)}</span>
                </div>
                {breakdown.quantityDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-600">
                        <span>Bulk Discount</span>
                        <span>-{(breakdown.quantityDiscount * 100).toFixed(0)}%</span>
                    </div>
                )}
                <div className="flex justify-between items-end border-t pt-2 mt-2">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold tracking-tight">{formatCurrency(breakdown.totalPrice)}</span>
                </div>
            </div>
        </div>
    );
};
