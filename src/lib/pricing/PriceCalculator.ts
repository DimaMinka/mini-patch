import type { PatchConfig, PriceBreakdown } from '@/lib/types/patch';
import {
    BASE_PRICE_PER_CM2,
    MATERIAL_MULTIPLIERS,
    QUANTITY_DISCOUNT_TIERS,
    LARGE_AREA_THRESHOLD,
    LARGE_AREA_MULTIPLIER,
} from '@/lib/constants';

function getQuantityDiscount(qty: number): number {
    const tier = QUANTITY_DISCOUNT_TIERS.find((t) => qty >= t.minQty);
    return tier?.discount ?? 0;
}

export function calculatePrice(config: PatchConfig): PriceBreakdown {
    const area = config.size.width * config.size.height;
    const basePrice = area * BASE_PRICE_PER_CM2;
    const materialMultiplier = MATERIAL_MULTIPLIERS[config.material];
    const sizeMultiplier = area > LARGE_AREA_THRESHOLD ? LARGE_AREA_MULTIPLIER : 1.0;
    const quantityDiscount = getQuantityDiscount(config.quantity);

    const unitPrice = basePrice * materialMultiplier * sizeMultiplier * (1 - quantityDiscount);
    const totalPrice = unitPrice * config.quantity;

    return {
        basePrice: +basePrice.toFixed(2),
        materialMultiplier,
        sizeMultiplier,
        quantityDiscount,
        unitPrice: +unitPrice.toFixed(2),
        totalPrice: +totalPrice.toFixed(2),
    };
}
