'use client';

import { useState } from 'react';
import { HeroChat } from '@/components/landing/HeroChat';
import { ConfiguratorModal } from '@/components/landing/ConfiguratorModal';

export default function Home() {
    const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

    return (
        <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
            <HeroChat onOpenConfigurator={() => setIsConfiguratorOpen(true)} />

            {isConfiguratorOpen && (
                <ConfiguratorModal
                    isOpen={isConfiguratorOpen}
                    onClose={() => setIsConfiguratorOpen(false)}
                />
            )}
        </main>
    );
}
