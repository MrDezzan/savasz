'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { IconArrowLeft, IconCheck } from '@/components/ui/icons';
import { LogoConstructor } from '@/components/alliance';
import Link from 'next/link';

export default function CreateAlliancePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState<'info' | 'logo'>('info');
    const [formData, setFormData] = useState({
        shortName: '',
        fullName: '',
        description: '',
        color: '#6366f1',
    });
    const [logoSvg, setLogoSvg] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="create-alliance-page">
                <div className="auth-required">
                    <h2>Требуется авторизация</h2>
                    <p>Войдите в аккаунт, чтобы создать альянс</p>
                    <Link href="/login" className="btn-primary">Войти</Link>
                </div>
            </div>
        );
    }

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.shortName.length < 2 || formData.shortName.length > 5) {
            setError('Короткое название должно быть от 2 до 5 символов');
            return;
        }
        if (formData.fullName.length < 3 || formData.fullName.length > 50) {
            setError('Название должно быть от 3 до 50 символов');
            return;
        }
        if (formData.description.length < 10 || formData.description.length > 500) {
            setError('Описание должно быть от 10 до 500 символов');
            return;
        }

        setStep('logo');
    };

    const handleLogoSave = async (svg: string) => {
        setLogoSvg(svg);
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem('sylvaire_token');
        if (!token) {
            setError('Требуется авторизация');
            setIsSubmitting(false);
            return;
        }

        try {
            const { createAlliance } = await import('@/lib/api');
            const result = await createAlliance(formData.shortName, formData.fullName, token);

            if (result.success) {
                console.log('[Alliance] Created successfully:', formData.shortName);
                router.push('/alliances');
            } else {
                setError(result.error || 'Ошибка при создании альянса');
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('[Alliance] Create failed:', err);
            setError('Ошибка при создании альянса');
            setIsSubmitting(false);
        }
    };

    const handleLogoCancel = () => {
        setStep('info');
    };

    if (step === 'logo') {
        return (
            <LogoConstructor
                onSave={handleLogoSave}
                onCancel={handleLogoCancel}
            />
        );
    }

    return (
        <div className="create-alliance-page">
            <div className="create-alliance-container">
                <Link href="/alliances" className="back-link">
                    <IconArrowLeft size={18} />
                    Назад к альянсам
                </Link>

                <h1>Создание альянса</h1>
                <p className="page-subtitle">Заполните информацию о вашем альянсе</p>

                <form className="alliance-form" onSubmit={handleInfoSubmit}>
                    <div className="form-group">
                        <label htmlFor="shortName">Короткое название (2-5 символов)</label>
                        <input
                            type="text"
                            id="shortName"
                            value={formData.shortName}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                shortName: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                            }))}
                            placeholder="ADM"
                            maxLength={5}
                            required
                        />
                        <span className="form-hint">Используется как тег, например @ADM</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Полное название</label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Название вашего альянса"
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Расскажите об альянсе, его целях и правилах..."
                            maxLength={500}
                            rows={5}
                            required
                        />
                        <span className="form-hint">{formData.description.length}/500</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Цвет альянса</label>
                        <div className="color-input-row">
                            <input
                                type="color"
                                id="color"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                            />
                            <span className="color-value">{formData.color}</span>
                        </div>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        <Link href="/alliances" className="btn-secondary">Отмена</Link>
                        <button type="submit" className="btn-primary">
                            Далее: Создать логотип
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
