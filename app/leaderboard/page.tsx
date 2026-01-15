'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLeaderboard, type LeaderboardPlayer } from '@/lib/api';
import { formatPlaytime } from '@/lib/utils';

type Period = 'all' | 'month' | 'week';

export default function LeaderboardPage() {
    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [period, setPeriod] = useState<Period>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const periodParam = period === 'all' ? undefined : period;
        getLeaderboard(periodParam)
            .then(setPlayers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [period]);

    const periods: { key: Period; label: string }[] = [
        { key: 'all', label: 'Всё время' },
        { key: 'month', label: 'Месяц' },
        { key: 'week', label: 'Неделя' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                    📊 Таблица лидеров
                </h1>
                <p className="text-slate-400 text-center mb-8">
                    Топ игроков по времени в игре
                </p>

                {/* Period Tabs */}
                <div className="flex justify-center gap-2 mb-8">
                    {periods.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setPeriod(p.key)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${period === p.key
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard */}
                <div className="glass rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="loading-spinner" />
                        </div>
                    ) : players.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            Нет данных за этот период
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {players.map((player, index) => (
                                <Link
                                    key={player.uuid}
                                    href={`/profile/${player.username}`}
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group"
                                >
                                    {/* Rank */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                            index === 1 ? 'bg-slate-400/20 text-slate-300' :
                                                index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-slate-700/50 text-slate-400'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Avatar */}
                                    <img
                                        src={`https://mc-heads.net/avatar/${player.username}/48`}
                                        alt=""
                                        className="w-12 h-12 rounded-xl"
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                                            {player.username}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {player.joinCount} заходов
                                        </p>
                                    </div>

                                    {/* Playtime */}
                                    <div className="text-right">
                                        <p className="font-semibold text-indigo-400">
                                            {formatPlaytime(player.totalPlaytimeSeconds)}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
