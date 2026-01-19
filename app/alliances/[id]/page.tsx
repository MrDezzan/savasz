'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alliance } from '@/lib/types/alliance';
import { getAlliance } from '@/lib/api';
import { IconUsers, IconDiscord, IconCrown, IconArrowLeft } from '@/components/ui/icons';

export default function AllianceDetailPage() {
    const params = useParams();
    const idParam = params?.id;
    // Decode shortName from URL, handling potential array or undefined
    const shortName = typeof idParam === 'string' ? decodeURIComponent(idParam) : '';

    const [alliance, setAlliance] = useState<Alliance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAlliance = async () => {
            setLoading(true);
            try {
                const data = await getAlliance(shortName);
                if (data) {
                    setAlliance({
                        id: data.id,
                        shortName: data.shortName,
                        fullName: data.fullName,
                        description: data.description || '',
                        logoSvg: '',
                        color: '#6366f1',
                        leaderUsername: data.leaderUsername,
                        memberCount: data.memberCount || 1,
                        createdAt: data.createdAt || new Date().toISOString(),
                        recruitmentStatus: 'OPEN' as const,
                        hasDiscord: false,
                        bannerUrl: data.bannerUrl,
                        leaderAvatarUrl: undefined
                    });
                } else {
                    setError('Альянс не найден');
                }
            } catch (err) {
                console.error('[AllianceDetail] Failed to load:', err);
                setError('Ошибка загрузки данных');
            }
            setLoading(false);
        };

        if (shortName) {
            loadAlliance();
        }
    }, [shortName]);

    if (loading) {
        return (
            <div className="alliance-detail-loading">
                <div className="loading-spinner" />
                <p>Загрузка информации об альянсе...</p>
            </div>
        );
    }

    if (error || !alliance) {
        return (
            <div className="alliance-detail-error">
                <h3>{error || 'Альянс не найден'}</h3>
                <Link href="/alliances" className="back-link">
                    <IconArrowLeft size={16} />
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="alliance-detail-page">
            <div className="alliance-detail-container">
                <Link href="/alliances" className="back-link">
                    <IconArrowLeft size={16} />
                    Назад к альянсам
                </Link>

                {/* Banner */}
                <div className="alliance-banner" style={{ backgroundColor: alliance.color }}>
                    {alliance.bannerUrl && (
                        <img src={alliance.bannerUrl} alt="Banner" className="alliance-banner-img" />
                    )}
                    <div className="alliance-header-overlay">
                        <div className="alliance-logo-large" style={{ borderColor: alliance.color }}>
                            {alliance.logoSvg ? (
                                <div dangerouslySetInnerHTML={{ __html: alliance.logoSvg }} />
                            ) : (
                                <span style={{ color: alliance.color }}>
                                    {alliance.shortName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="alliance-header-info">
                            <h1 className="alliance-title">{alliance.fullName}</h1>
                            <div className="alliance-meta-row">
                                <span className="alliance-tag">@{alliance.shortName}</span>
                                <span className="alliance-stat">
                                    <IconUsers size={16} />
                                    {alliance.memberCount} участников
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="alliance-content-grid">
                    {/* Main Info */}
                    <div className="alliance-main-col">
                        <div className="alliance-card-section">
                            <h2>Описание</h2>
                            <p className="alliance-description">
                                {alliance.description || 'Описание отсутствует'}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="alliance-side-col">
                        <div className="alliance-card-section">
                            <h3>Лидер</h3>
                            <div className="alliance-leader-row">
                                <IconCrown size={16} className="leader-crown" />
                                <img
                                    src={`https://mc-heads.net/avatar/${alliance.leaderUsername}/32`}
                                    alt={alliance.leaderUsername}
                                    className="leader-avatar-large"
                                />
                                <span className="leader-name-large">{alliance.leaderUsername}</span>
                            </div>
                        </div>

                        <div className="alliance-card-section">
                            <h3>Информация</h3>
                            <div className="info-list">
                                <div className="info-item">
                                    <span className="label">Создан:</span>
                                    <span className="value">
                                        {new Date(alliance.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Статус набора:</span>
                                    <span className="value">
                                        {alliance.recruitmentStatus === 'OPEN' ? 'Открыт' : 'Закрыт'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
