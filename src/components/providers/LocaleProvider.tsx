'use client';

import { usePatchStore } from '@/stores/usePatchStore';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import ruMessages from '@/messages/ru.json';
import heMessages from '@/messages/he.json';

const messages = {
    en: enMessages,
    ru: ruMessages,
    he: heMessages,
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
    const locale = usePatchStore((state) => state.locale);
    const dir = usePatchStore((state) => state.dir);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [dir, locale, mounted]);

    // Avoid hydration mismatch by waiting for mount:
    // We must render NextIntlClientProvider even during SSR/hydration to avoid "No IntlProvider found" error.
    // The locale will be 'en' (default) initially, then update after hydration from localStorage.

    // If not mounted yet, we rely on default locale to render content.
    // We suppress hydration warning on the body in layout.tsx if needed, but here we just render.

    return (
        <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="UTC">
            {children}
        </NextIntlClientProvider>
    );
};
