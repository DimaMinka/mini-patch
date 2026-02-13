import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { RtlToggle } from './RtlToggle';

export const AppHeader = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-8 flex items-center space-x-2">
                    <span className="h-6 w-6 rounded-lg bg-primary" />
                    <span className="hidden font-bold sm:inline-block">Antigravity Patch</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center space-x-1">
                        <RtlToggle />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
};
