'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { IconX, IconAlliance } from '@/components/ui/icons';
import LogoConstructor from './LogoConstructor';

interface CreateAllianceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateAllianceModal({ isOpen, onClose }: CreateAllianceModalProps) {
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

    if (!isOpen || !user) return null;

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
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

        try {
            // TODO: Send to API
            console.log('Creating alliance:', { ...formData, logoSvg: svg });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success - redirect to new alliance
            onClose();
            router.push('/alliances/new'); // TODO: redirect to actual alliance ID
        } catch (err) {
            setError('Ошибка при создании альянса');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoCancel = () => {
        setStep('info');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-alliance-modal" onClick={(e) => e.stopPropagation()}>
                {step === 'info' ? (
                    <>
                        <div className="modal-header">
                            <h2>Создание альянса</h2>
                            <button className="modal-close" onClick={onClose}>
                                <IconX size={20} />
                            </button>
                        </div>

                        <form className="modal-body" onSubmit={handleInfoSubmit}>
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
                                    placeholder="Например: ADM"
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
                                    placeholder="Полное название альянса"
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
                                    placeholder="Расскажите об альянсе..."
                                    maxLength={500}
                                    rows={4}
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

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={onClose}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn-primary">
                                    Далее: Создать логотип
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <LogoConstructor
                        onSave={handleLogoSave}
                        onCancel={handleLogoCancel}
                    />
                )}
            </div>
        </div>
    );
}
