'use client';

import { useEffect } from 'react';
import { usePatchStore } from '@/stores/usePatchStore';

export const RtlProvider = ({ children }: { children: React.ReactNode }) => {
    const dir = usePatchStore((state) => state.dir);

    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
    }, [dir]);

    return <>{children}</>;
};
