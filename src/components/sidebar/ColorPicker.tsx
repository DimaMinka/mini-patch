import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { usePatchStore } from '@/stores/usePatchStore';

const TACTICAL_COLORS = [
    { label: 'Ranger Green', value: '#354E35' },
    { label: 'Olive Drab', value: '#556B2F' },
    { label: 'Coyote Brown', value: '#8B5A2B' },
    { label: 'Tan', value: '#D2B48C' },
    { label: 'Black', value: '#1A1A1A' },
    { label: 'Wolf Grey', value: '#7D7F7D' },
    { label: 'Navy Blue', value: '#000080' },
    { label: 'Maroon', value: '#800000' },
];

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
    allowCustom?: boolean;
}

import { useTranslations } from 'next-intl';

// ... (TACTICAL_COLORS definition)

export const ColorPicker = ({ label, value, onChange, allowCustom = false }: ColorPickerProps) => {
    const t = useTranslations('sidebar');
    const dir = usePatchStore((state) => state.dir);

    return (
        <div className="space-y-3" dir={dir}>
            <h3 className="text-sm font-medium text-muted-foreground text-start">{label}</h3>
            <div className="flex flex-wrap gap-2">
                {TACTICAL_COLORS.map((color) => (
                    <Button
                        key={color.value}
                        variant="outline"
                        className={cn(
                            "w-8 h-8 rounded-full p-0 relative transition-all",
                            value === color.value ? "border-2 border-white ring-2 ring-primary" : "border ring-1 ring-border"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => onChange(color.value)}
                        title={t(`colors.${color.label}`)}
                    >
                        {value === color.value && (
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                        <span className="sr-only">{t(`colors.${color.label}`)}</span>
                    </Button>
                ))}
            </div>
            {allowCustom && (
                <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 w-full p-1 border rounded cursor-pointer"
                    />
                </div>
            )}
        </div>
    );
};
