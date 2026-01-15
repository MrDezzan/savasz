'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Organization {
    id: number;
    shortName: string;
    fullName: string;
    bannerUrl?: string;
    leaderUsername: string;
    memberCount?: number;
}

export default function OrgsPage() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<{ success: boolean; organizations: Organization[] }>('/api/orgs')
            .then((data) => {
                if (data.organizations) {
                    setOrgs(data.organizations);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen py-12 container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    🏢 Организации
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Объединения игроков, корпорации и политические партии сервера Sylvaire.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="loading-spinner" />
                </div>
            ) : orgs.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                    <p className="text-2xl mb-4">📭</p>
                    <h3 className="text-xl font-semibold text-white">Список пуст</h3>
                    <p className="text-slate-400">Пока не создано ни одной организации.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orgs.map((org) => (
                        <Link
                            href={`/orgs/${org.shortName}`}
                            key={org.id}
                            className="card group hover:-translate-y-1 block relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-900/50 to-transparent -z-10" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                    {org.bannerUrl ? (
                                        <img src={org.bannerUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        org.shortName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 border border-white/5">
                                    ID: {org.id}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{org.fullName}</h3>
                            <p className="text-indigo-400 text-sm font-mono mb-4">@{org.shortName}</p>

                            <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {org.leaderUsername}
                                </div>
                                <div>
                                    👥 {org.memberCount || 0} уч.
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
