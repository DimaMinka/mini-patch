'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePatchStore } from '@/stores/usePatchStore';
import { useTranslations } from 'next-intl';

export const AppHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dir = usePatchStore((state) => state.dir);
    const t = useTranslations('header');
    const setChatAction = usePatchStore((state) => state.setChatAction);

    const handleMobileAction = (action: string) => {
        setChatAction(action);
        setIsMenuOpen(false);
    };

    const MENU_ITEMS = [
        { key: 'products', label: t('nav.products') },
        { key: 'upload', label: t('nav.upload') },
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
                <nav className="hidden md:flex items-center gap-6 mx-6 flex-1">
                    {MENU_ITEMS.map((item) => (
                        item.key === 'upload' ? (
                            <Link
                                key={item.key}
                                href="/upload"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <button
                                key={item.key}
                                onClick={() => setChatAction(item.key)}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                            >
                                {item.label}
                            </button>
                        )
                    ))}
                </nav>

                <div className="flex flex-1 md:flex-none items-center justify-end gap-2">
                    <nav className="flex items-center gap-1">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-muted"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-xl p-4 animate-in slide-in-from-top-2 duration-200 z-50">
                    <nav className="flex flex-col gap-4">
                        {MENU_ITEMS.map((item) => (
                            item.key === 'upload' ? (
                                <Link
                                    key={item.key}
                                    href="/upload"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-start px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    key={item.key}
                                    onClick={() => handleMobileAction(item.key)}
                                    className="text-lg font-medium text-start px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </button>
                            )
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};
