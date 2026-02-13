import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePatchStore } from '@/stores/usePatchStore';
import { calculatePrice } from '@/lib/pricing/PriceCalculator';

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const PriceDisplay = () => {
    const dir = usePatchStore((state) => state.dir);
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
        <div className="bg-card p-4 lg:p-6 shadow-up lg:shadow-none lg:border-s lg:border-t-0 lg:h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground text-start">Quantity</span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
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
                        className="w-14 h-7 text-center px-1"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setQuantity(config.quantity + 1)}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-start">Unit Price</span>
                    <span className="font-medium">{formatCurrency(breakdown.unitPrice)}</span>
                </div>
                {breakdown.quantityDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-medium">
                        <span className="text-start">Bulk Discount</span>
                        <span>-{(breakdown.quantityDiscount * 100).toFixed(0)}%</span>
                    </div>
                )}
                <div className="flex justify-between items-end border-t pt-4 mt-2">
                    <span className="font-semibold text-start">Total</span>
                    <span className="text-2xl font-bold tracking-tight">{formatCurrency(breakdown.totalPrice)}</span>
                </div>
            </div>
        </div>
    );
};
