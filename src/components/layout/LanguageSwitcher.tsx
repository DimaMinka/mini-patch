'use client';

import { usePatchStore } from '@/stores/usePatchStore';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export const LanguageSwitcher = () => {
    const locale = usePatchStore((state) => state.locale);
    const setLocale = usePatchStore((state) => state.setLocale);

    // We want to loop through available languages.
    // Order: EN -> RU -> HE -> EN
    const toggleLanguage = () => {
        if (locale === 'en') setLocale('ru');
        else if (locale === 'ru') setLocale('he');
        else setLocale('en');
    };

    const getFlag = (loc: string) => {
        switch (loc) {
            case 'en': return '🇺🇸';
            case 'ru': return '🇷🇺';
            case 'he': return '🇮🇱';
            default: return '🌐';
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="w-12 px-0 font-bold"
            title={`Current: ${locale.toUpperCase()}`}
        >
            <span className="text-lg me-1">{getFlag(locale)}</span>
            <span className="text-xs">{locale.toUpperCase()}</span>
        </Button>
    );
};
