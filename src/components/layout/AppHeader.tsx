'use client';

import { useState } from 'react';
import { Menu, X, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { usePatchStore } from '@/stores/usePatchStore';
import { useTranslations } from 'next-intl';

export const AppHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dir = usePatchStore((state) => state.dir);
    const t = useTranslations('header');
    const setChatAction = usePatchStore((state) => state.setChatAction);
    const pathname = usePathname();

    const isUploadPage = pathname?.endsWith('/upload');

    const handleMobileAction = (action: string) => {
        setChatAction(action);
        setIsMenuOpen(false);
    };

    const MENU_ITEMS = [
        { key: 'products', label: t('nav.products') },
        { key: 'gallery', label: t('nav.gallery') },
        { key: 'about', label: t('nav.about') },
        { key: 'contact', label: t('nav.contact') },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md" dir={dir}>
            <div className="flex h-16 items-center px-4 md:px-6 w-full max-w-7xl mx-auto">
                <Link href="/" className="me-8 flex items-center gap-2">
                    <span className="text-3xl leading-none filter drop-shadow-sm">🦎</span>
                    <span className="hidden font-bold text-xl sm:inline-block tracking-tight text-primary">{t('title')}</span>
                </Link>

                {/* Desktop Navigation */}
                {!isUploadPage && (
                    <nav className="hidden md:flex items-center gap-6 mx-6 flex-1">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setChatAction(item.key)}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                )}

                <div className="flex flex-1 items-center justify-end gap-0.5">
                    <nav className="flex items-center gap-0">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <Button variant="ghost" size="icon-sm" asChild>
                            <Link
                                href="/upload"
                                className="text-foreground transition-colors"
                                title={t('nav.upload')}
                            >
                                <UploadCloud className="h-[1.2rem] w-[1.2rem]" />
                            </Link>
                        </Button>
                        {!isUploadPage && (
                            <button
                                className="md:hidden p-2 rounded-md hover:bg-muted"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-xl p-4 animate-in slide-in-from-top-2 duration-200 z-50">
                    <nav className="flex flex-col gap-4">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleMobileAction(item.key)}
                                className="text-lg font-medium text-start px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};
