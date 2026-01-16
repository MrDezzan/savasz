'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogEntry, LogActionType } from '@/lib/types/logs';
import { IconFilter, IconSearch, IconAlliance, IconUser, IconComment, IconBan, IconCrown, IconTrash } from '@/components/ui/icons';

const ACTION_LABELS: Record<LogActionType, string> = {
    ALLIANCE_CREATED: 'Создание альянса',
    ALLIANCE_DELETED: 'Удаление альянса',
    ALLIANCE_UPDATED: 'Изменение альянса',
    APPLICATION_ACCEPTED: 'Заявка принята',
    APPLICATION_REJECTED: 'Заявка отклонена',
    POST_DELETED: 'Удаление публикации',
    COMMENT_DELETED: 'Удаление комментария',
    USER_BANNED: 'Бан пользователя',
    USER_UNBANNED: 'Разбан пользователя',
    ROLE_CHANGED: 'Изменение роли',
    LEADERSHIP_TRANSFERRED: 'Передача лидерства',
};

const getActionIcon = (type: LogActionType) => {
    switch (type) {
        case 'ALLIANCE_CREATED':
        case 'ALLIANCE_DELETED':
        case 'ALLIANCE_UPDATED':
            return <IconAlliance size={16} />;
        case 'APPLICATION_ACCEPTED':
        case 'APPLICATION_REJECTED':
            return <IconUser size={16} />;
        case 'POST_DELETED':
        case 'COMMENT_DELETED':
            return <IconTrash size={16} />;
        case 'USER_BANNED':
        case 'USER_UNBANNED':
            return <IconBan size={16} />;
        case 'ROLE_CHANGED':
        case 'LEADERSHIP_TRANSFERRED':
            return <IconCrown size={16} />;
    }
};

export default function AdminLogsPage() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<LogActionType | 'all'>('all');

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }

        // TODO: Fetch logs from API
        const loadLogs = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            // Logs loaded from backend API
            setLogs([]);
            setLoading(false);
        };

        loadLogs();
    }, [isAdmin, router]);

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = searchQuery === '' ||
            log.initiatorUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.targetName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || log.type === filterType;
        return matchesSearch && matchesType;
    });

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-logs-page">
            <div className="logs-header">
                <h1>Системные логи</h1>
                <p className="logs-subtitle">Журнал действий на сайте</p>
            </div>

            {/* Filters */}
            <div className="logs-filters">
                <div className="logs-search">
                    <IconSearch size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск по пользователю..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    className="logs-filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as LogActionType | 'all')}
                >
                    <option value="all">Все действия</option>
                    {Object.entries(ACTION_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Logs list */}
            <div className="logs-content">
                {loading ? (
                    <div className="logs-loading">
                        <div className="loading-spinner" />
                        <p>Загрузка логов...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="logs-empty">
                        <p>Логи не найдены</p>
                    </div>
                ) : (
                    <div className="logs-table">
                        <div className="logs-table-header">
                            <span className="col-action">Действие</span>
                            <span className="col-initiator">Инициатор</span>
                            <span className="col-target">Объект</span>
                            <span className="col-reason">Причина</span>
                            <span className="col-date">Дата</span>
                        </div>
                        {filteredLogs.map(log => (
                            <div key={log.id} className="log-row">
                                <span className="col-action">
                                    <span className="log-action-icon">{getActionIcon(log.type)}</span>
                                    {ACTION_LABELS[log.type]}
                                </span>
                                <span className="col-initiator">
                                    <span className={`initiator-role ${log.initiatorRole.toLowerCase()}`}>
                                        {log.initiatorRole === 'ADMIN' ? 'Админ' :
                                            log.initiatorRole === 'LEADER' ? 'Лидер' : 'Зам'}
                                    </span>
                                    {log.initiatorUsername}
                                </span>
                                <span className="col-target">{log.targetName}</span>
                                <span className="col-reason">{log.reason || '—'}</span>
                                <span className="col-date">{formatDate(log.createdAt)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
