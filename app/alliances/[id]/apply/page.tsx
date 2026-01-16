'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alliance } from '@/lib/types/alliance';
import { IconArrowLeft, IconSend } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

// Mock alliance data
const mockAlliance: Alliance = {
    id: 2,
    shortName: 'BLD',
    fullName: 'Builders Guild',
    description: 'Гильдия строителей.',
    logoSvg: '<svg viewBox="0 0 16 16" fill="#3b82f6"><polygon points="8,2 14,14 2,14"/></svg>',
    color: '#3b82f6',
    leaderUsername: 'MasterBuilder',
    memberCount: 12,
    createdAt: '2024-02-15',
    recruitmentStatus: 'OPEN',
    hasDiscord: true,
};

export default function ApplyToAlliancePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [alliance, setAlliance] = useState<Alliance | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        age: '',
        purpose: '',
        about: '',
    });

    useEffect(() => {
        const loadAlliance = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            setAlliance(mockAlliance);
            setLoading(false);
        };
        loadAlliance();
    }, [params.id]);

    if (!user) {
        return (
            <div className="apply-page">
                <div className="auth-required">
                    <h2>Требуется авторизация</h2>
                    <p>Войдите в аккаунт, чтобы подать заявку</p>
                    <Link href="/login" className="btn-primary">Войти</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="apply-page">
                <div className="apply-loading">
                    <div className="loading-spinner" />
                </div>
            </div>
        );
    }

    if (!alliance || alliance.recruitmentStatus === 'CLOSED') {
        return (
            <div className="apply-page">
                <div className="apply-closed">
                    <h2>Набор закрыт</h2>
                    <p>Этот альянс в данный момент не принимает заявки</p>
                    <Link href="/alliances" className="btn-secondary">К списку альянсов</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 10 || age > 100) {
            setError('Укажите корректный возраст (10-100)');
            return;
        }
        if (formData.purpose.length < 10 || formData.purpose.length > 300) {
            setError('Цель вступления должна быть от 10 до 300 символов');
            return;
        }
        if (formData.about.length < 20 || formData.about.length > 500) {
            setError('Расскажите о себе подробнее (20-500 символов)');
            return;
        }

        setSubmitting(true);

        try {
            // TODO: Send to API
            console.log('Submitting application:', { allianceId: params.id, ...formData });
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch (err) {
            setError('Ошибка при отправке заявки');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="apply-page">
                <div className="apply-success">
                    <div className="success-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="9,12 11,14 15,10" />
                        </svg>
                    </div>
                    <h2>Заявка отправлена!</h2>
                    <p>Руководство альянса рассмотрит вашу заявку и вы получите уведомление о решении.</p>
                    <div className="success-actions">
                        <Link href={`/alliances/${alliance.id}`} className="btn-secondary">
                            К альянсу
                        </Link>
                        <Link href="/alliances" className="btn-primary">
                            К списку альянсов
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="apply-page">
            <div className="apply-container">
                <Link href={`/alliances/${alliance.id}`} className="back-link">
                    <IconArrowLeft size={18} />
                    Назад к альянсу
                </Link>

                {/* Alliance info */}
                <div className="apply-alliance-info">
                    <div
                        className="apply-alliance-logo"
                        style={{ borderColor: alliance.color }}
                        dangerouslySetInnerHTML={{ __html: alliance.logoSvg }}
                    />
                    <div>
                        <h1>Заявка в {alliance.fullName}</h1>
                        <span className="apply-alliance-tag" style={{ color: alliance.color }}>
                            @{alliance.shortName}
                        </span>
                    </div>
                </div>

                {/* Application form */}
                <form className="apply-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="age">Ваш возраст</label>
                        <input
                            type="number"
                            id="age"
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                            placeholder="Например: 16"
                            min={10}
                            max={100}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="purpose">Зачем вы хотите вступить?</label>
                        <textarea
                            id="purpose"
                            value={formData.purpose}
                            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                            placeholder="Опишите причину, по которой хотите присоединиться к альянсу..."
                            maxLength={300}
                            rows={3}
                            required
                        />
                        <span className="form-hint">{formData.purpose.length}/300</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="about">Расскажите о себе</label>
                        <textarea
                            id="about"
                            value={formData.about}
                            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                            placeholder="Ваш опыт, интересы на сервере, чем можете быть полезны..."
                            maxLength={500}
                            rows={5}
                            required
                        />
                        <span className="form-hint">{formData.about.length}/500</span>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        <Link href={`/alliances/${alliance.id}`} className="btn-secondary">
                            Отмена
                        </Link>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            <IconSend size={18} />
                            {submitting ? 'Отправка...' : 'Отправить заявку'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
