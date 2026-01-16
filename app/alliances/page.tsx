'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Alliance } from '@/lib/types/alliance';
import AllianceCard from '@/components/alliance/AllianceCard';
import { IconPlus, IconSearch, IconAlliance } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

// Mock data for demonstration
const mockAlliances: Alliance[] = [
    {
        id: 1,
        shortName: 'ADM',
        fullName: 'Администрация',
        description: 'Официальная администрация сервера Sylvaire. Мы следим за порядком и помогаем игрокам.',
        logoSvg: '<svg viewBox="0 0 16 16" fill="#ef4444"><rect x="4" y="2" width="8" height="12" rx="1"/><rect x="6" y="4" width="4" height="2" fill="#fff"/></svg>',
        color: '#ef4444',
        leaderUsername: 'IDezzan',
        memberCount: 5,
        createdAt: '2024-01-01',
        recruitmentStatus: 'CLOSED',
        hasDiscord: true,
    },
    {
        id: 2,
        shortName: 'BLD',
        fullName: 'Builders Guild',
        description: 'Гильдия строителей. Создаём масштабные проекты и помогаем новичкам освоить строительство.',
        logoSvg: '<svg viewBox="0 0 16 16" fill="#3b82f6"><polygon points="8,2 14,14 2,14"/></svg>',
        color: '#3b82f6',
        leaderUsername: 'MasterBuilder',
        memberCount: 12,
        createdAt: '2024-02-15',
        recruitmentStatus: 'OPEN',
        hasDiscord: true,
    },
    {
        id: 3,
        shortName: 'TRD',
        fullName: 'Trade Company',
        description: 'Торговая компания. Занимаемся торговлей ресурсами и предметами между игроками.',
        logoSvg: '<svg viewBox="0 0 16 16" fill="#10b981"><circle cx="8" cy="8" r="6"/><text x="8" y="11" text-anchor="middle" fill="#fff" font-size="8">$</text></svg>',
        color: '#10b981',
        leaderUsername: 'Merchant',
        memberCount: 8,
        createdAt: '2024-03-01',
        recruitmentStatus: 'BY_INVITE',
        hasDiscord: false,
    },
];

export default function AlliancesPage() {
    const { user } = useAuth();
    const [alliances, setAlliances] = useState<Alliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // TODO: Replace with actual API call
        const loadAlliances = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setAlliances(mockAlliances);
            setLoading(false);
        };

        loadAlliances();
    }, []);

    const filteredAlliances = alliances.filter(a =>
        a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="alliances-page">
            <div className="alliances-header">
                <div className="alliances-title-row">
                    <h1 className="alliances-title">Альянсы</h1>
                    {user && (
                        <Link href="/alliances/create" className="create-alliance-btn">
                            <IconPlus size={18} />
                            Создать альянс
                        </Link>
                    )}
                </div>
                <p className="alliances-subtitle">
                    Объединения игроков, корпорации и политические партии сервера
                </p>

                {/* Search */}
                <div className="alliances-search">
                    <IconSearch size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск альянсов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Alliances grid */}
            <div className="alliances-content">
                {loading ? (
                    <div className="alliances-loading">
                        <div className="loading-spinner" />
                        <p>Загрузка альянсов...</p>
                    </div>
                ) : filteredAlliances.length === 0 ? (
                    <div className="alliances-empty">
                        <div className="alliances-empty-icon">
                            <IconAlliance size={48} />
                        </div>
                        <h3>Альянсы не найдены</h3>
                        {searchQuery ? (
                            <p>Попробуйте изменить поисковый запрос</p>
                        ) : (
                            <>
                                <p>Пока не создано ни одного альянса</p>
                                {user && (
                                    <Link href="/alliances/create" className="create-alliance-btn-secondary">
                                        Создать первый альянс
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="alliances-grid">
                        {filteredAlliances.map(alliance => (
                            <AllianceCard key={alliance.id} alliance={alliance} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
