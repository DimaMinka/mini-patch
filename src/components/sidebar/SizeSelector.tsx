import { Button } from '@/components/ui/button';
import { usePatchStore } from '@/stores/usePatchStore';
import { SIZE_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { PatchSize } from '@/lib/types/patch';

export const SizeSelector = () => {
    const dir = usePatchStore((state) => state.dir);
    const currentSize = usePatchStore((s) => s.size);
    const setSize = usePatchStore((s) => s.setSize);

    const isSelected = (preset: PatchSize) =>
        currentSize.width === preset.width && currentSize.height === preset.height;

    return (
        <div className="space-y-3" dir={dir}>
            <h3 className="text-sm font-medium text-muted-foreground text-start">Size</h3>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                    <Button
                        key={key}
                        variant="outline"
                        className={cn(
                            "h-14 flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                            isSelected(preset)
                                ? "border-2 border-primary bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)] dark:shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
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
