import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitOrderButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SubmitOrderButton = ({ onClick, isLoading, disabled }: SubmitOrderButtonProps) => {
    return (
        <Button
            className="w-full h-12 text-lg font-semibold shadow-md active:scale-[0.98] transition-all"
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="me-2 h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : (
                "Submit Order"
            )}
        </Button>
    );
};
