'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, ArrowDown, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePatchStore } from '@/stores/usePatchStore';

interface PatchResult {
    id: string;
    image_url: string;
    description: string;
    metadata: any;
    similarity: number;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    patches?: PatchResult[];
}

interface HeroChatProps {
    onOpenConfigurator: () => void;
}

export const HeroChat = ({ onOpenConfigurator }: HeroChatProps) => {
    const t = useTranslations('chat');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const chatAction = usePatchStore((state) => state.chatAction);
    const setChatAction = usePatchStore((state) => state.setChatAction);

    // Initial greeting
    useEffect(() => {
        setTimeout(() => {
            setMessages([
                { id: '1', role: 'ai', content: t('intro') }
            ]);
        }, 500);
    }, [t]);

    // Handle external triggers from Header Menu
    useEffect(() => {
        if (chatAction) {
            // Check if it's a known key in translations, otherwise fallback
            const message = ['products', 'gallery', 'about', 'contact'].includes(chatAction)
                ? t(`actions.${chatAction}`)
                : chatAction;

            if (chatAction === 'products') {
                handleSend(message, { type: 'latest', limit: 9 });
            } else {
                handleSend(message);
            }
            setChatAction(null);
        }
    }, [chatAction, setChatAction, t]);

    const handleSend = async (contentOverride?: string, options: { type?: 'latest', limit?: number } = {}) => {
        const content = contentOverride || inputValue;
        if (!content.trim()) return;

        // 1. Add User Message
        const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        if (!contentOverride) setInputValue('');
        setIsTyping(true);

        try {
            // 2. Call Search API
            const res = await fetch('/mini-patch/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: content,
                    type: options.type,
                    limit: options.limit
                }),
            });

            const data = await res.json();
            const patches = data.results || [];

            // 3. Add AI Response
            let aiContent = '';
            if (options.type === 'latest') {
                aiContent = patches.length > 0
                    ? t('foundLatest', { count: patches.length }) // We need to add this key
                    : t('notFound', { query: content });
            } else {
                aiContent = patches.length > 0
                    ? t('found', { count: patches.length, query: content })
                    : t('notFound', { query: content });
            }

            const aiMsg: Message = {
                id: crypto.randomUUID(),
                role: 'ai',
                content: aiContent,
                patches
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Search failed:', error);
            const errorMsg: Message = {
                id: crypto.randomUUID(),
                role: 'ai',
                content: t('error')
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section className="relative flex flex-col items-center justify-center h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-teal/20 via-background to-background overflow-hidden px-4">

            {/* Background Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

            {/* Chat Container */}
            <div className="w-full max-w-2xl bg-card/40 backdrop-blur-xl border border-brand-teal/30 rounded-2xl shadow-2xl p-6 flex flex-col h-[60vh] md:h-[500px] relative z-10 transition-all hover:border-brand-teal/50">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-brand-teal/20 scrollbar-track-transparent pr-2">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-brand-teal text-white' : 'bg-muted text-muted-foreground'}`}>
                                {msg.role === 'ai' ? <span className="text-lg">🦎</span> : <User size={18} />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                : 'bg-muted/50 border border-border rounded-tl-sm'
                                }`}>
                                <p>{msg.content}</p>
                                {msg.patches && msg.patches.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {msg.patches.map((patch) => (
                                            <div
                                                key={patch.id}
                                                className="relative aspect-square bg-background/50 rounded-lg border border-border overflow-hidden group cursor-pointer hover:border-brand-teal transition-colors"
                                                onClick={() => setSelectedImage(patch.image_url)}
                                                title={patch.metadata?.unit_name || patch.description}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={patch.image_url}
                                                    alt="Found Patch"
                                                    className="w-full h-full object-contain p-2"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                    <span className="text-white text-[10px] font-medium truncate w-full">
                                                        {patch.metadata?.unit || patch.metadata?.organization || 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0">
                                <span className="text-lg">🦎</span>
                            </div>
                            <div className="bg-muted/50 border border-border p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="relative flex items-center gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('placeholder')}
                        className="pr-12 h-12 bg-background/50 border-brand-teal/20 focus-visible:ring-brand-teal/50 transition-all font-medium"
                    />
                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        className="absolute right-1 top-1 h-10 w-10 bg-brand-gradient hover:opacity-90 transition-opacity"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>

            {/* Configurator CTA */}
            <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Button
                    variant="ghost"
                    onClick={onOpenConfigurator}
                    className="group text-muted-foreground hover:text-brand-teal transition-colors gap-2"
                >
                    {t('openConfigurator')}
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </Button>
            </div>

            {/* Image Popup Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
                        >
                            <X size={32} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedImage}
                            alt="Full View"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        />
                    </div>
                </div>
            )}

        </section>
    );
};
