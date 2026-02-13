import { usePatchStore } from '@/stores/usePatchStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TEXTURE_MAP } from '@/lib/constants';
import type { PatchMaterial } from '@/lib/types/patch';

export const MaterialSelector = () => {
    const currentMaterial = usePatchStore((s) => s.material);
    const setMaterial = usePatchStore((s) => s.setMaterial);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Material</h3>
            <div className="flex flex-col gap-2">
                {(Object.keys(TEXTURE_MAP) as PatchMaterial[]).map((material) => {
                    const info = TEXTURE_MAP[material];
                    return (
                        <Button
                            key={material}
                            variant="outline"
                            className={cn(
                                "justify-start h-10 px-4 transition-all duration-200 text-foreground",
                                currentMaterial === material
                                    ? "border-2 border-primary bg-primary/10 dark:bg-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(var(--primary),0.1)] dark:shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                            onClick={() => setMaterial(material)}
                        >
                            {info.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
