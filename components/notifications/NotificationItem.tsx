'use client';

import Link from 'next/link';
import { Notification, NotificationType } from '@/lib/types/notifications';
import { IconCheck, IconX, IconComment, IconHeart, IconAlliance, IconAlert } from '@/components/ui/icons';

interface NotificationItemProps {
    notification: Notification;
    onMarkRead?: (id: number) => void;
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'APPLICATION_ACCEPTED': return <IconCheck size={18} className="notification-icon success" />;
            case 'APPLICATION_REJECTED': return <IconX size={18} className="notification-icon error" />;
            case 'NEW_APPLICATION': return <IconAlliance size={18} className="notification-icon primary" />;
            case 'NEW_COMMENT': return <IconComment size={18} className="notification-icon" />;
            case 'POST_LIKED': return <IconHeart size={18} className="notification-icon like" />;
            case 'ALLIANCE_INVITE': return <IconAlliance size={18} className="notification-icon primary" />;
            case 'SYSTEM': return <IconAlert size={18} className="notification-icon warning" />;
        }
    };

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'только что';
        if (diff < 3600) return Math.floor(diff / 60) + ' мин.';
        if (diff < 86400) return Math.floor(diff / 3600) + ' ч.';
        if (diff < 604800) return Math.floor(diff / 86400) + ' дн.';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const content = (
        <div className={`notification-item ${notification.isRead ? '' : 'unread'}`}>
            <div className="notification-icon-wrapper">
                {getIcon(notification.type)}
            </div>
            <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
            </div>
            {!notification.isRead && onMarkRead && (
                <button
                    className="notification-mark-read"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMarkRead(notification.id);
                    }}
                >
                    <IconCheck size={14} />
                </button>
            )}
        </div>
    );

    if (notification.linkUrl) {
        return <Link href={notification.linkUrl} className="notification-link">{content}</Link>;
    }

    return content;
}
