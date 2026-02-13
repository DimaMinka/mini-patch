import { useRef, ChangeEvent } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatchStore } from '@/stores/usePatchStore';
import { cn } from '@/lib/utils';

export const ImageUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userImageDataUrl = usePatchStore((s) => s.userImageDataUrl);
    const setUserImage = usePatchStore((s) => s.setUserImage);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File too large (max 5MB)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
                setUserImage(result);
            }
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be selected again
        e.target.value = '';
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Upload Image</h3>

            {!userImageDataUrl ? (
                <div
                    className="border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-3 bg-secondary rounded-full">
                        <Upload className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0 relative">
                        {/* Simple preview or icon */}
                        <img src={userImageDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Custom Image</p>
                        <p className="text-xs text-muted-foreground">Uploaded</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setUserImage(null)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/png, image/jpeg, image/svg+xml"
                className="hidden"
            />
        </div>
    );
};
