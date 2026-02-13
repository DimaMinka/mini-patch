'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { RtlToggle } from './RtlToggle';

export const AppHeader = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
                <Link href="/" className="me-8 flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="h-6 w-6 rounded-lg bg-primary" />
                    <span className="hidden font-bold sm:inline-block">Antigravity Patch</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2 rtl:space-x-reverse">
                    <nav className="flex items-center space-x-1 rtl:space-x-reverse">
                        <RtlToggle />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
};
