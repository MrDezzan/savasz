'use client';

import { useState, useEffect } from 'react';
import { Notification } from '@/lib/types/notifications';
import NotificationItem from '@/components/notifications/NotificationItem';
import { IconBell, IconCheck } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

// Mock notifications
const mockNotifications: Notification[] = [
    {
        id: 1,
        type: 'APPLICATION_ACCEPTED',
        title: 'Заявка принята',
        message: 'Ваша заявка в альянс "Builders Guild" была одобрена!',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false,
        linkUrl: '/alliances/2',
    },
    {
        id: 2,
        type: 'POST_LIKED',
        title: 'Новый лайк',
        message: 'PlayerOne оценил вашу публикацию',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: false,
        relatedUsername: 'PlayerOne',
    },
    {
        id: 3,
        type: 'NEW_COMMENT',
        title: 'Новый комментарий',
        message: 'MasterBuilder прокомментировал вашу публикацию',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isRead: true,
        relatedUsername: 'MasterBuilder',
    },
    {
        id: 4,
        type: 'SYSTEM',
        title: 'Обновление сервера',
        message: 'Сервер был обновлён до версии 1.21. Подробности в Discord.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true,
    },
];

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call
        const loadNotifications = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            setNotifications(mockNotifications);
            setLoading(false);
        };

        loadNotifications();
    }, []);

    const handleMarkRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (!user) {
        return (
            <div className="notifications-page">
                <div className="notifications-empty">
                    <IconBell size={48} />
                    <h3>Войдите в аккаунт</h3>
                    <p>Чтобы видеть уведомления, необходимо авторизоваться</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div className="notifications-title-row">
                    <h1 className="notifications-title">
                        Уведомления
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </h1>
                    {unreadCount > 0 && (
                        <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
                            <IconCheck size={16} />
                            Прочитать все
                        </button>
                    )}
                </div>
            </div>

            <div className="notifications-content">
                {loading ? (
                    <div className="notifications-loading">
                        <div className="loading-spinner" />
                        <p>Загрузка уведомлений...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="notifications-empty">
                        <IconBell size={48} />
                        <h3>Нет уведомлений</h3>
                        <p>Здесь будут появляться важные события</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkRead={handleMarkRead}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
