import { Shield, Circle, Square, LucideIcon } from 'lucide-react';
import { usePatchStore } from '@/stores/usePatchStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PatchShape } from '@/lib/types/patch';

const SHAPES: { value: PatchShape; label: string; Icon: LucideIcon }[] = [
    { value: 'shield', label: 'Shield', Icon: Shield },
    { value: 'circle', label: 'Circle', Icon: Circle },
    { value: 'rectangle', label: 'Rectangle', Icon: Square },
];

export const ShapeSelector = () => {
    const dir = usePatchStore((state) => state.dir);
    const currentShape = usePatchStore((s) => s.shape);
    const setShape = usePatchStore((s) => s.setShape);

    return (
        <div className="space-y-3" dir={dir}>
            <h3 className="text-sm font-medium text-muted-foreground text-start">Shape</h3>
            <div className="grid grid-cols-3 gap-2">
                {SHAPES.map(({ value, label, Icon }) => (
                    <Button
                        key={value}
                        variant="outline"
                        className={cn(
                            "h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                            currentShape === value
                                ? "border-2 border-primary bg-primary/10 dark:bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)] dark:shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                        onClick={() => setShape(value)}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs">{label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};
