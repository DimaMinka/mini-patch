'use client';

import { Languages } from 'lucide-react';
import { usePatchStore } from '@/stores/usePatchStore';
import { Button } from '@/components/ui/button';

export const RtlToggle = () => {
    const dir = usePatchStore((state) => state.dir);
    const toggleDir = usePatchStore((state) => state.toggleDir);

    return (
        <Button variant="ghost" size="icon" onClick={toggleDir} title={dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}>
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle RTL/LTR</span>
        </Button>
    );
};
