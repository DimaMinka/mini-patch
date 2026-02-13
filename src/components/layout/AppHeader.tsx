'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { RtlToggle } from './RtlToggle';
import { usePatchStore } from '@/stores/usePatchStore';

export const AppHeader = () => {
    const dir = usePatchStore((state) => state.dir);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir={dir}>
            <div className="flex h-14 items-center px-4 md:px-6 w-full">
                <Link href="/" className="me-8 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-primary shadow-sm" />
                    <span className="hidden font-bold sm:inline-block">Antigravity Patch</span>
                </Link>
                <div className="flex flex-1 items-center justify-end gap-2">
                    <nav className="flex items-center gap-1">
                        <RtlToggle />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
};
