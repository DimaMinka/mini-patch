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
                            variant={currentMaterial === material ? 'default' : 'outline'}
                            className={cn(
                                "justify-start h-10 px-4",
                                currentMaterial === material && "bg-primary text-primary-foreground"
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
