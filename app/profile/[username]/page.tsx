'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfile, type PlayerProfile } from '@/lib/api';
import { formatPlaytime, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (username) {
            setLoading(true);
            getProfile(username)
                .then((data) => {
                    if (data) {
                        setProfile(data);
                    } else {
                        setError(true);
                    }
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-6xl mb-4">😔</p>
                <h1 className="text-2xl font-bold text-white mb-2">Игрок не найден</h1>
                <p className="text-slate-400 mb-6">Игрок &quot;{username}&quot; не существует</p>
                <Link href="/leaderboard" className="btn-secondary">
                    К таблице лидеров
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/leaderboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад к статистике
                </Link>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left - Avatar & Skin */}
                    <div className="glass rounded-2xl p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <img
                                src={profile.skinUrl}
                                alt=""
                                className="w-40 h-80 mx-auto"
                                style={{ imageRendering: 'pixelated' }}
                            />
                            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-slate-500'
                                }`} />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            {profile.username}
                            {profile.hasSubscription && (
                                <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/50">
                                    +
                                </span>
                            )}
                        </h1>

                        {/* Tags */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {profile.hasSubscription && (
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-amber-600 text-white shadow-lg shadow-amber-500/20">
                                    ⭐ Sub
                                </span>
                            )}
                            {profile.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm font-semibold"
                                    style={{ background: tag.color + '33', color: tag.color }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        {profile.hasSubscription && (
                            <div className="mb-4 text-amber-400 font-medium text-sm">
                                ✨ Подписка активна
                                {profile.subscriptionExpiry && profile.subscriptionExpiry !== 'ACTIVE' && (
                                    <span className="block text-xs opacity-75">до {formatDate(profile.subscriptionExpiry)}</span>
                                )}
                            </div>
                        )}

                        <p className={`text-sm ${profile.isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                            {profile.isOnline ? '🟢 Онлайн' : `Был ${formatDate(profile.lastSeen)}`}
                        </p>
                    </div>

                    {/* Right - Stats */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Playtime */}
                        <div className="glass rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">⏱️ Время в игре</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-400">{formatPlaytime(profile.totalPlaytimeSeconds)}</p>
                                    <p className="text-sm text-slate-400">Всего</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-400">{formatPlaytime(profile.monthlyPlaytime)}</p>
                                    <p className="text-sm text-slate-400">За месяц</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-pink-400">{formatPlaytime(profile.weeklyPlaytime)}</p>
                                    <p className="text-sm text-slate-400">За неделю</p>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="glass rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">📋 Информация</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Первый вход</span>
                                    <span className="text-white">{formatDate(profile.firstJoin)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Заходов на сервер</span>
                                    <span className="text-white">{profile.joinCount}</span>
                                </div>
                                {profile.discordId && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Discord</span>
                                        <span className="text-indigo-400">Привязан ✓</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {profile.description && (
                            <div className="glass rounded-2xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">✏️ О себе</h2>
                                <p className="text-slate-300 whitespace-pre-wrap">{profile.description}</p>
                            </div>
                        )}
                        {/* Organization */}
                        {profile.organization && (
                            <Link
                                href={`/orgs/${profile.organization.shortName}`}
                                className="glass rounded-2xl p-6 block group hover:bg-white/5 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    🏢 Организация
                                    <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-lg border border-white/10">
                                        {profile.organization.bannerUrl ? (
                                            <img src={profile.organization.bannerUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            profile.organization.shortName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{profile.organization.fullName}</h3>
                                        <p className="text-indigo-400 font-mono text-sm">@{profile.organization.shortName}</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
