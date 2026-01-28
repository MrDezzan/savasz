'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '@/lib/api';
import { IconSearch, IconUsers, IconDiscord } from '@/components/ui/icons';

export default function ParticipantsPage() {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
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

            unique.sort((a, b) => a.username.localeCompare(b.username));
            setEntries(unique);
            setLoading(false);
        });
    }, []);

    const filteredEntries = entries.filter(entry =>
        entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="forum-leaderboard-page">
            <div className="page-header">
                <h1 className="page-title">Участники</h1>
                <p className="page-subtitle">Все игроки проекта</p>
            </div>

            <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
                <div className="search-input-wrapper">
                    <IconSearch size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск участника..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="leaderboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка...</p>
                </div>
            ) : filteredEntries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p>Никого не найдено</p>
                </div>
            ) : (
                <div className="participants-album-grid">
                    {filteredEntries.map((player) => (
                        <Link href={`/profile/${player.username}`} key={player.username} className="participant-card-mini">
                            <div className="card-face">
                                <img
                                    src={`https://mc-heads.net/avatar/${player.username}/48`}
                                    alt={player.username}
                                    className="player-face-img"
                                    loading="lazy"
                                />
                                {player.isOnline && <span className="online-dot-mini"></span>}
                            </div>
                            <div className="card-info">
                                <div className="player-nick">{player.username}</div>
                                {player.discordUsername && (
                                    <div className="player-discord">
                                        <IconDiscord size={12} className="discord-mini-icon" />
                                        <span>{player.discordUsername}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <style jsx>{`
                .participants-album-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 16px;
                    padding: 0 16px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .participant-card-mini {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .participant-card-mini:hover {
                    background: rgba(30, 41, 59, 0.9);
                    border-color: rgba(99, 102, 241, 0.5);
                    transform: translateY(-2px);
                }

                .card-face {
                    position: relative;
                    margin-bottom: 12px;
                }

                .player-face-img {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .online-dot-mini {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #22c55e;
                    border: 2px solid #1e293b;
                    border-radius: 50%;
                }

                .card-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    width: 100%;
                }

                .player-nick {
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .player-discord {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #94a3b8;
                    font-size: 11px;
                    background: rgba(88, 101, 242, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                
                .discord-mini-icon {
                    opacity: 0.7;
                }
                
                /* Reuse existing styles from global or leaderboards */
                .search-input-wrapper {
                    position: relative;
                    width: 100%;
                }
                
                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }
                
                .search-input {
                    width: 100%;
                    padding: 12px 12px 12px 42px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    border-radius: 12px;
                    color: white;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: rgba(15, 23, 42, 0.8);
                }
            `}</style>
        </section>
    );
}
