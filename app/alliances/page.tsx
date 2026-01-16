'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Alliance } from '@/lib/types/alliance';
import AllianceCard from '@/components/alliance/AllianceCard';
import { IconPlus, IconSearch, IconAlliance } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

export default function AlliancesPage() {
    const { user } = useAuth();
    const [alliances, setAlliances] = useState<Alliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // TODO: Replace with actual API call
        const loadAlliances = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            // Alliances will be loaded from backend API
            setAlliances([]);
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
                    Объединения игроков, гильдии и команды сервера
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
