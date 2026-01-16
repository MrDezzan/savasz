'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AllianceApplication, Alliance } from '@/lib/types/alliance';
import ApplicationCard from '@/components/alliance/ApplicationCard';
import { IconArrowLeft, IconFilter } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

// Mock data
const mockApplications: AllianceApplication[] = [
    {
        id: 1,
        allianceId: 2,
        applicantUsername: 'NewPlayer',
        age: 18,
        purpose: 'Хочу научиться строить большие проекты и работать в команде',
        about: 'Играю в Minecraft уже 3 года, люблю строить в survival режиме. Могу помочь с ресурсной базой.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 2,
        allianceId: 2,
        applicantUsername: 'CoolBuilder',
        age: 15,
        purpose: 'Давно слежу за вашими постройками, хочу быть частью команды',
        about: 'Специализируюсь на средневековых постройках. Есть опыт работы с WorldEdit.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: 3,
        allianceId: 2,
        applicantUsername: 'OldMember',
        age: 20,
        purpose: 'Возвращаюсь на сервер',
        about: 'Был участником раньше, хочу вернуться.',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        reviewedBy: 'MasterBuilder',
    },
];

type FilterStatus = 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

export default function ApplicationsPage() {
    const params = useParams();
    const { user } = useAuth();
    const [applications, setApplications] = useState<AllianceApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>('PENDING');

    useEffect(() => {
        const loadApplications = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            setApplications(mockApplications);
            setLoading(false);
        };
        loadApplications();
    }, [params.id]);

    const handleAccept = async (id: number) => {
        // TODO: API call
        console.log('Accept application:', id);
        setApplications(prev =>
            prev.map(app => app.id === id ? { ...app, status: 'ACCEPTED' as const } : app)
        );
    };

    const handleReject = async (id: number, reason: string) => {
        // TODO: API call
        console.log('Reject application:', id, reason);
        setApplications(prev =>
            prev.map(app => app.id === id ? {
                ...app,
                status: 'REJECTED' as const,
                rejectionReason: reason,
            } : app)
        );
    };

    const filteredApplications = applications.filter(app =>
        filter === 'all' || app.status === filter
    );

    const pendingCount = applications.filter(a => a.status === 'PENDING').length;

    return (
        <div className="applications-page">
            <div className="applications-header">
                <Link href={`/alliances/${params.id}`} className="back-link">
                    <IconArrowLeft size={18} />
                    Назад к альянсу
                </Link>

                <div className="applications-title-row">
                    <h1>
                        Заявки
                        {pendingCount > 0 && (
                            <span className="pending-count">{pendingCount}</span>
                        )}
                    </h1>
                </div>

                {/* Filter tabs */}
                <div className="applications-filter">
                    <button
                        className={`filter-tab ${filter === 'PENDING' ? 'active' : ''}`}
                        onClick={() => setFilter('PENDING')}
                    >
                        Ожидают ({applications.filter(a => a.status === 'PENDING').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'ACCEPTED' ? 'active' : ''}`}
                        onClick={() => setFilter('ACCEPTED')}
                    >
                        Приняты
                    </button>
                    <button
                        className={`filter-tab ${filter === 'REJECTED' ? 'active' : ''}`}
                        onClick={() => setFilter('REJECTED')}
                    >
                        Отклонены
                    </button>
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все
                    </button>
                </div>
            </div>

            <div className="applications-content">
                {loading ? (
                    <div className="applications-loading">
                        <div className="loading-spinner" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="applications-empty">
                        <p>Нет заявок в этой категории</p>
                    </div>
                ) : (
                    <div className="applications-list">
                        {filteredApplications.map(application => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                onAccept={application.status === 'PENDING' ? handleAccept : undefined}
                                onReject={application.status === 'PENDING' ? handleReject : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
