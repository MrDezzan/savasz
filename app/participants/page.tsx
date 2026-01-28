'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '@/lib/api';
import { IconSearch, IconUsers } from '@/components/ui/icons';

export default function ParticipantsPage() {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        // Using getLeaderboard('ALL_TIME') as a proxy for all registered users for now
        getLeaderboard('ALL_TIME').then((data) => {
            // Deduplicate by username
            const unique = data.reduce((acc, current) => {
                const x = acc.find(item => item.username === current.username);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, [] as LeaderboardEntry[]);

            // Sort alphabetically or by join date if available, here just by name for album view
            unique.sort((a, b) => a.username.localeCompare(b.username));

            setEntries(unique);
            setLoading(false);
        });
    }, []);

    const filteredEntries = entries.filter(entry =>
        entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="participants-page">
            <div className="container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <IconUsers size={32} />
                    </div>
                    <h1 className="page-title">Участники</h1>
                    <p className="page-subtitle">Все зарегистрированные игроки проекта</p>
                </div>

                <div className="search-container">
                    <div className="search-input-wrapper">
                        <IconSearch size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск игрока..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="participants-count">
                        Всего: {entries.length}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Загрузка списка участников...</p>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>Игроки не найдены</h3>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                ) : (
                    <div className="participants-grid">
                        {filteredEntries.map((player) => (
                            <Link href={`/profile/${player.username}`} key={player.username} className="participant-card">
                                <div className="card-bg" style={{ backgroundImage: `url(https://mc-heads.net/avatar/${player.username}/128)` }}></div>
                                <div className="card-content">
                                    <div className="player-avatar">
                                        <img
                                            src={`https://mc-heads.net/avatar/${player.username}/64`}
                                            alt={player.username}
                                            loading="lazy"
                                        />
                                        {player.isOnline && <span className="online-badge"></span>}
                                    </div>
                                    <h3 className="player-name">{player.username}</h3>
                                    <div className="player-meta">
                                        <span className="join-date">
                                            {player.formattedPlaytime ? `${Math.floor(player.totalPlaytimeSeconds / 3600)} ч.` : '0 ч.'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .participants-page {
                    min-height: 100vh;
                    padding: 40px 0;
                    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .header-icon-wrapper {
                    display: inline-flex;
                    padding: 16px;
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 20px;
                    color: #818cf8;
                    margin-bottom: 20px;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
                }

                .page-title {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .page-subtitle {
                    color: #64748b;
                    font-size: 16px;
                }

                .search-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .search-input-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    padding: 12px 12px 12px 44px;
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .search-input:focus {
                    background: rgba(30, 41, 59, 0.8);
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                    outline: none;
                }

                .participants-count {
                    color: #64748b;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 8px 16px;
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 20px;
                    border: 1px solid rgba(148, 163, 184, 0.1);
                }

                .participants-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .participant-card {
                    position: relative;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    border-radius: 16px;
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 24px;
                }

                .participant-card:hover {
                    transform: translateY(-4px);
                    background: rgba(30, 41, 59, 0.7);
                    border-color: rgba(99, 102, 241, 0.4);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
                }

                .card-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 80px;
                    background-size: cover;
                    background-position: center;
                    opacity: 0.1;
                    filter: blur(8px);
                    transition: opacity 0.3s;
                }

                .participant-card:hover .card-bg {
                    opacity: 0.2;
                }

                .card-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .player-avatar {
                    position: relative;
                    margin-bottom: 16px;
                }

                .player-avatar img {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s;
                }

                .participant-card:hover .player-avatar img {
                    transform: scale(1.05);
                }

                .online-badge {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: #22c55e;
                    border: 2px solid #1e293b;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
                }

                .player-name {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    text-align: center;
                }

                .player-meta {
                    color: #94a3b8;
                    font-size: 13px;
                }

                .loading-state, .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    color: #94a3b8;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(99, 102, 241, 0.3);
                    border-radius: 50%;
                    border-top-color: #6366f1;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 640px) {
                    .participants-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }
                    
                    .search-container {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .search-input-wrapper {
                        max-width: none;
                    }
                    
                    .participants-count {
                        align-self: flex-start;
                    }
                }
            `}</style>
        </section>
    );
}
