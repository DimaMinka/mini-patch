export type PatchShape = 'shield' | 'circle' | 'rectangle' | 'custom';

export type PatchMaterial = 'cordura' | 'pvc' | 'embroidery';

export interface PatchSize {
    width: number;   // cm
    height: number;  // cm
    label: string;   // e.g. "8×5 cm"
}

export interface PatchConfig {
    shape: PatchShape;
    material: PatchMaterial;
    size: PatchSize;
    backgroundColor: string;  // hex
    borderColor: string;      // hex
    quantity: number;
    userImageDataUrl: string | null;
}

export interface PriceBreakdown {
    basePrice: number;
    materialMultiplier: number;
    sizeMultiplier: number;
    quantityDiscount: number;
    unitPrice: number;
    totalPrice: number;
}

// Submit payload → redirect to external payment
export interface PatchOrderPayload {
    config: PatchConfig;
    price: PriceBreakdown;
    previewBase64: string;     // canvas.toDataURL()
    redirectUrl?: string;      // external shop payment URL
}

// Chat message for RAG agent
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
