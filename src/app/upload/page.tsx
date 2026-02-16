'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import type { PatchMetadata } from '@/lib/types/patch';

export default function UploadPage() {
    const t = useTranslations('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ id: string; metadata: PatchMetadata } | null>(null);
    const [userPassword, setUserPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('upload-password');
        if (saved) {
            setUserPassword(saved);
            verifyPassword(saved);
        }
    }, []);

    const verifyPassword = async (pass: string) => {
        if (!pass) {
            setIsAuthorized(false);
            return;
        }
        setIsValidating(true);
        try {
            const res = await fetch('/mini-patch/api/auth/verify', {
                method: 'POST',
                headers: { 'x-upload-password': pass }
            });
            setIsAuthorized(res.ok);
        } catch (e) {
            setIsAuthorized(false);
        } finally {
            setIsValidating(false);
        }
    };

    const handlePasswordChange = (val: string) => {
        setUserPassword(val);
        localStorage.setItem('upload-password', val);
        verifyPassword(val);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.size > 5 * 1024 * 1024) {
                alert('File too large (max 5MB)');
                return;
            }
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
            setResult(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) {
            setFile(dropped);
            setPreviewUrl(URL.createObjectURL(dropped));
            setResult(null);
        }
    };

    const handleSubmit = async () => {
        if (!file || !description) return;

        setIsSubmitting(true);
        try {
            // 1. Upload Image & Create Record
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);

            const uploadRes = await fetch('/mini-patch/api/upload', {
                method: 'POST',
                headers: {
                    'x-upload-password': userPassword,
                },
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json().catch(() => ({}));
                console.error(`Upload failed (${uploadRes.status}):`, errorData);
                if (uploadRes.status === 401) throw new Error('Incorrect password');
                throw new Error(errorData.error || 'Upload failed');
            }
            const { id } = await uploadRes.json();

            // 2. Extract Metadata
            const extractRes = await fetch('/mini-patch/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-upload-password': userPassword,
                },
                body: JSON.stringify({ id, description }),
            });

            if (!extractRes.ok) {
                const errorData = await extractRes.json().catch(() => ({ error: 'Extraction failed' }));
                console.error('Extraction failed response:', errorData);
                if (extractRes.status === 401) throw new Error('Incorrect password');
                throw new Error(errorData.error || 'Extraction failed');
            }
            const metadata = await extractRes.json();

            setResult({ id, metadata });

            // Clean up form
            setFile(null);
            setPreviewUrl(null);
            setDescription('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Error saving patch');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

            <div className="space-y-6">
                {/* Password Protection */}
                <div className="bg-secondary/30 p-4 rounded-xl border border-border shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Lock className={`w-4 h-4 ${isAuthorized ? 'text-green-500' : 'text-primary'}`} />
                            <span>Access Password</span>
                        </div>
                        {isValidating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                        {!isValidating && userPassword && (
                            <span className={`text-xs font-bold ${isAuthorized ? 'text-green-500' : 'text-red-500'}`}>
                                {isAuthorized ? '✓ Authorized' : '✗ Incorrect'}
                            </span>
                        )}
                    </div>
                    <Input
                        type="password"
                        placeholder="Enter password to unlock upload"
                        value={userPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`bg-background/50 ${userPassword && !isAuthorized && !isValidating ? 'border-red-500/50' : ''}`}
                    />
                </div>

                {isAuthorized ? (
                    <>
                        {/* Image Uploader */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-input hover:border-primary/50 hover:bg-muted/50'
                                }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative w-full aspect-video md:aspect-[2/1] bg-black/5 rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPreviewUrl(null);
                                            setResult(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">{t('dragDrop')}</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 5MB)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <Textarea
                                placeholder={t('descriptionPlaceholder')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] resize-none text-base"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            size="lg"
                            className="w-full font-semibold"
                            onClick={handleSubmit}
                            disabled={!file || !description.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('analyzing')}
                                </>
                            ) : (
                                t('submit')
                            )}
                        </Button>

                        {/* Result Display */}
                        {result && (
                            <div className="bg-muted/30 border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-500">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <h3 className="font-bold text-lg">Patch Saved & Analyzed</h3>
                                </div>

                                <div className="grid gap-4 text-sm bg-card p-4 rounded-lg border shadow-sm">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <div className="text-muted-foreground">Category</div>
                                        <div className="font-medium capitalize">{result.metadata.category}</div>

                                        <div className="text-muted-foreground">Organization</div>
                                        <div className="font-medium">{result.metadata.organization || '-'}</div>

                                        {result.metadata.unit_name && (
                                            <>
                                                <div className="text-muted-foreground">Unit Name</div>
                                                <div className="font-medium">{result.metadata.unit_name}</div>
                                            </>
                                        )}

                                        <div className="text-muted-foreground">Colors</div>
                                        <div className="font-medium">{result.metadata.colors.join(', ')}</div>

                                        <div className="text-muted-foreground">Features</div>
                                        <div className="font-medium">{result.metadata.features.join(', ')}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-xl border border-dashed animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Locked Console</h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Please enter the correct access password above to unlock the upload and analysis tools.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
