import { Button } from '@/components/ui/button';
import { usePatchStore } from '@/stores/usePatchStore';
import { SIZE_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { PatchSize } from '@/lib/types/patch';

export const SizeSelector = () => {
    const currentSize = usePatchStore((s) => s.size);
    const setSize = usePatchStore((s) => s.setSize);

    const isSelected = (preset: PatchSize) =>
        currentSize.width === preset.width && currentSize.height === preset.height;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                    <Button
                        key={key}
                        variant="outline"
                        className={cn(
                            "h-14 flex flex-col items-center justify-center gap-0.5 transition-all text-foreground",
                            isSelected(preset)
                                ? "border-2 border-primary bg-primary/5 text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setSize(preset)}
                    >
                        <span className="text-sm font-semibold">{key}</span>
                        <span className="text-[10px] text-muted-foreground">{preset.label}</span>
                    </Button>
                ))}
            </div>
            {/* TODO: Add 'Custom' tab if needed */}
        </div>
    );
};
