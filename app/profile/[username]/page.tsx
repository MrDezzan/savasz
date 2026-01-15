'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProfile, PlayerProfile, updateDescription } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import SkinViewer from '@/components/SkinViewer';
import { toast } from 'sonner';

export default function ProfilePage() {
    const params = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editDesc, setEditDesc] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!params?.username) return;

        setLoading(true);
        const decodedUsername = decodeURIComponent(params.username as string);

        getProfile(decodedUsername).then((p) => {
            if (p) {
                setProfile(p);
                setEditDesc(p.description || '');
            } else {
                setError('Игрок не найден');
            }
            setLoading(false);
        }).catch(() => {
            setError('Ошибка загрузки профиля');
            setLoading(false);
        });
    }, [params]);

    const handleSaveDescription = async () => {
        if (!profile || !user) return;

        setIsSaving(true);
        try {
            const result = await updateDescription(profile.username, editDesc, user.token);
            if (result.success) {
                setProfile({ ...profile, description: editDesc });
                setIsEditing(false);
                toast.success('Описание обновлено');
            } else {
                toast.error('Ошибка обновления: ' + result.error);
            }
        } catch (e) {
            toast.error('Не удалось сохранить изменения');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatLastSeen = (hours: number) => {
        if (hours === 0) return 'Только что';
        if (hours < 24) return `${hours} ч. назад`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Вчера';
        if (days < 7) return `${days} дн. назад`;
        if (days < 30) return `${Math.floor(days / 7)} нед. назад`;
        return `${Math.floor(days / 30)} мес. назад`;
    };

    if (loading) {
        return (
            <section className="profile-page">
                <div className="container">
                    <div className="profile-loading">
                        <div className="loading-spinner"></div>
                        <p>Загрузка профиля...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !profile) {
        return (
            <section className="profile-page">
                <div className="container">
                    <div className="profile-error">
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>😔</div>
                        <h2 style={{ marginBottom: '12px' }}>Ошибка</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                        <Link href="/leaderboard" className="btn btn-primary" style={{ marginTop: '24px' }}>К лидерборду</Link>
                    </div>
                </div>
            </section>
        );
    }

    const isOwnProfile = user?.username === profile.username;

    return (
        <section className="profile-page">
            <div className="container">
                <Link href="/leaderboard" className="back-link">← Вернуться к лидерборду</Link>

                <div className="profile-container">
                    <div className="profile-left">
                        <div className="skin-card">
                            <div className="skin-viewer-container">
                                <SkinViewer
                                    skinUrl={profile.skinUrl}
                                    width={300}
                                    height={400}
                                />
                            </div>

                            <div className={`online-badge ${profile.isOnline ? '' : 'offline'}`} style={{ marginTop: '16px' }}>
                                {profile.isOnline && <span className="online-dot"></span>}
                                {profile.isOnline ? 'Онлайн' : formatLastSeen(profile.hoursSinceLastSeen)}
                            </div>

                            <h1 className="player-username-large">{profile.username}</h1>
                            <div className="player-tags">
                                {profile.tags && profile.tags.map((tag, idx) => {
                                    if (tag.name === 'Админ') return <span key={idx} className="tag tag-admin">👑 {tag.name}</span>;
                                    if (tag.name === '+') return <span key={idx} className="tag tag-sub">⭐ Подписка {tag.expiresIn && `(${tag.expiresIn})`}</span>;
                                    return <span key={idx} className="tag tag-org">{tag.name}</span>;
                                })}
                            </div>

                            {profile.discordId && (
                                <div className="discord-info">
                                    <svg className="discord-icon" viewBox="0 0 24 24">
                                        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02" />
                                    </svg>
                                    <span>Привязан к Discord</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{profile.formattedPlaytime}</div>
                                <div className="stat-label">Всего наиграно</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{profile.monthPlaytimeFormatted || '0с'}</div>
                                <div className="stat-label">За месяц</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{profile.weekPlaytimeFormatted || '0с'}</div>
                                <div className="stat-label">За неделю</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-title">📋 Информация</div>
                            <div className="info-row">
                                <span className="info-label">Первый вход</span>
                                <span className="info-value">{formatDate(profile.firstJoin)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Последний онлайн</span>
                                <span className="info-value">{profile.isOnline ? 'Сейчас онлайн' : formatDate(profile.lastSeen)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Заходов на сервер</span>
                                <span className="info-value">{profile.joinCount}</span>
                            </div>
                        </div>

                        {profile.hasSubscription && (
                            <div className="info-card subscription-card">
                                <div className="info-title">⭐ Подписка</div>
                                <div className="info-row">
                                    <span className="info-label">Статус</span>
                                    <span className="subscription-active">Активна</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Действует</span>
                                    <span className="info-value">
                                        {profile.subscriptionExpires === 'permanent'
                                            ? 'Навсегда'
                                            : profile.subscriptionExpires
                                                ? `до ${formatDate(profile.subscriptionExpires)}`
                                                : 'Активна'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="description-card">
                            <div className="description-header">
                                <div className="info-title">📝 О себе</div>
                                {isOwnProfile && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="edit-btn"
                                        title="Редактировать описание"
                                    >
                                        ✏️
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="description-editor">
                                    <textarea
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="Расскажите немного о себе..."
                                        maxLength={500}
                                        disabled={isSaving}
                                    />
                                    <div className="editor-actions">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditDesc(profile.description || '');
                                            }}
                                            disabled={isSaving}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleSaveDescription}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={`description-text ${profile.description ? '' : 'no-description'}`}>
                                    {profile.description || 'Пользователь пока не добавил описание'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
