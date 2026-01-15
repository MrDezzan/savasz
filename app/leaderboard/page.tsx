'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry, LeaderboardPeriod } from '@/lib/api';

export default function LeaderboardPage() {
    const [period, setPeriod] = useState<LeaderboardPeriod>('ALL_TIME');
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        setLoading(true);
        getLeaderboard(period).then((data) => {
            setEntries(data);
            setLoading(false);
        });
    }, [period]);

    const formatPlaytime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}ч ${minutes}м`;
    };

    const getRankClass = (index: number) => {
        switch (index) {
            case 0: return 'gold';
            case 1: return 'silver';
            case 2: return 'bronze';
            default: return 'normal';
        }
    };

    return (
        <section className="leaderboard-page">
            <div className="container">
                <Link href="/" className="back-link">← Вернуться на главную</Link>

                <div className="page-header">
                    <h1 className="page-title">Топ игроков по <span className="accent">онлайну</span></h1>
                    <p className="page-subtitle">Рейтинг игроков по времени, проведённому на сервере</p>
                </div>

                <div className="period-tabs">
                    <button
                        className={`period-tab ${period === 'ALL_TIME' ? 'active' : ''}`}
                        onClick={() => setPeriod('ALL_TIME')}
                    >
                        За всё время
                    </button>

                    <button
                        className={`period-tab ${period === 'MONTH' ? 'active' : ''}`}
                        onClick={() => setPeriod('MONTH')}
                    >
                        Месяц
                    </button>
                    <button
                        className={`period-tab ${period === 'WEEK' ? 'active' : ''}`}
                        onClick={() => setPeriod('WEEK')}
                    >
                        Неделя
                    </button>
                </div>

                <div id="leaderboard-container">
                    {loading ? (
                        <div className="leaderboard-loading">
                            <div className="loading-spinner"></div>
                            <p>Загрузка лидерборда...</p>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p>Нет данных за этот период</p>
                        </div>
                    ) : (
                        <div className="leaderboard-list">
                            {entries.map((entry, index) => (
                                <Link href={`/profile/${entry.username}`} key={entry.username} className={`leaderboard-item clickable ${entry.isOnline ? 'online' : ''}`}>
                                    <div className={`rank-badge ${getRankClass(index)}`}>
                                        {index + 1}
                                    </div>
                                    <div className="player-avatar-large">
                                        <img
                                            src={`https://mc-heads.net/avatar/${entry.username}/56`}
                                            alt={entry.username}
                                            onError={(e) => { e.currentTarget.src = 'https://mc-heads.net/avatar/MHF_Steve/56'; }}
                                        />
                                    </div>
                                    <div className="player-details">
                                        <div className="player-username">
                                            {entry.username}
                                            {entry.isOnline && (
                                                <span className="online-indicator">
                                                    <span className="online-dot"></span>
                                                    Онлайн
                                                </span>
                                            )}
                                        </div>
                                        <div className="player-stats">
                                            <span>Всего наиграно:</span>
                                            <span className="player-playtime">
                                                {entry.totalPlaytimeSeconds ? Math.floor(entry.totalPlaytimeSeconds / 3600) : 0} ч.
                                            </span>
                                        </div>
                                    </div>
                                    <div className="profile-arrow">→</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
