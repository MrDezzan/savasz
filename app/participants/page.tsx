'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '@/lib/api';
import { IconSearch, IconDiscord } from '@/components/ui/icons';

export default function ParticipantsPage() {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        getLeaderboard('ALL_TIME').then((data) => {
            const unique = data.reduce((acc, current) => {
                const x = acc.find(item => item.username === current.username);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, [] as LeaderboardEntry[]);

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
            <div className="page-header">
                <h1 className="page-title">Участники</h1>
                <p className="page-subtitle">Сообщество проекта Sylvaire</p>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <IconSearch size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск игрока..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Загрузка участников...</p>
                </div>
            ) : filteredEntries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p>Никто не найден</p>
                </div>
            ) : (
                <div className="participants-grid">
                    {filteredEntries.map((player) => (
                        <Link href={`/profile/${player.username}`} key={player.username} className="player-card">
                            <div className="card-border"></div>
                            <div className="card-content">
                                <div className="avatar-wrapper">
                                    <img
                                        src={`https://mc-heads.net/avatar/${player.username}/64`}
                                        alt={player.username}
                                        className="player-avatar"
                                        loading="lazy"
                                    />
                                    {player.isOnline && <span className="status-dot tooltip" data-tip="Онлайн"></span>}
                                </div>
                                <div className="player-info">
                                    <div className="player-name">{player.username}</div>
                                    {player.discordUsername && (
                                        <div className="discord-tag">
                                            <IconDiscord size={14} />
                                            <span>{player.discordUsername}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <style jsx>{`
                .participants-page {
                    padding: 40px 20px;
                    max-width: 1400px;
                    margin: 0 auto;
                    animation: fadeIn 0.4s ease-out;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 40px;
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
                    color: #94a3b8;
                    font-size: 16px;
                }

                .search-container {
                    max-width: 500px;
                    margin: 0 auto 50px;
                }

                .search-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    border-radius: 16px;
                    padding: 0 16px;
                    transition: all 0.2s;
                }

                .search-wrapper:focus-within {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(99, 102, 241, 0.5);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .search-icon {
                    color: #64748b;
                    transition: color 0.2s;
                    flex-shrink: 0;
                }

                .search-wrapper:focus-within .search-icon {
                    color: #818cf8;
                }

                .search-input {
                    width: 100%;
                    padding: 14px 0 14px 12px;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 15px;
                }

                .search-input:focus {
                    outline: none;
                }

                .participants-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .player-card {
                    position: relative;
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card-border {
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }

                .card-content {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    z-index: 1;
                    position: relative;
                }

                .player-card:hover {
                    transform: translateY(-4px);
                    background: rgba(30, 41, 59, 0.6);
                    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3);
                }

                .player-card:hover .card-border {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(99, 102, 241, 0.1));
                }

                .avatar-wrapper {
                    position: relative;
                    padding: 4px;
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .player-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    display: block;
                    transition: transform 0.3s ease;
                }

                .player-card:hover .player-avatar {
                    transform: scale(1.05);
                }

                .status-dot {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: #22c55e;
                    border: 3px solid #1e293b;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
                }

                .player-info {
                    text-align: center;
                    width: 100%;
                }

                .player-name {
                    color: #f1f5f9;
                    font-weight: 700;
                    font-size: 16px;
                    margin-bottom: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .discord-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    background: rgba(88, 101, 242, 0.1);
                    border: 1px solid rgba(88, 101, 242, 0.2);
                    border-radius: 20px;
                    color: #818cf8;
                    font-size: 12px;
                    font-weight: 500;
                    margin-top: 4px;
                    max-width: 100%;
                }
                
                .discord-tag span {
                     white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .loading-state, .empty-state {
                    text-align: center;
                    padding: 60px 0;
                    color: #94a3b8;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: #6366f1;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
