'use client';

import { useEffect, useState } from 'react';
import { usePatchStore } from '@/stores/usePatchStore';

export const RtlProvider = ({ children }: { children: React.ReactNode }) => {
    const dir = usePatchStore((state) => state.dir);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('dir', dir);
        }
    }, [dir, mounted]);

    // Prevent hydration mismatch by not rendering or just rendering children
    // but the dir attribute is external to the React tree anyway.
    return <>{children}</>;
};
