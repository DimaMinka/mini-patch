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
    const currentShape = usePatchStore((s) => s.shape);
    const setShape = usePatchStore((s) => s.setShape);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Shape</h3>
            <div className="grid grid-cols-3 gap-2">
                {SHAPES.map(({ value, label, Icon }) => (
                    <Button
                        key={value}
                        variant={currentShape === value ? 'default' : 'outline'}
                        className={cn(
                            "h-20 flex flex-col items-center justify-center gap-2",
                            currentShape === value && "ring-2 ring-primary ring-offset-1"
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
