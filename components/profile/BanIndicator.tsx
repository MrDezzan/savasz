'use client';

import { IconBan, IconClock } from '@/components/ui/icons';

interface BanIndicatorProps {
    isBanned: boolean;
    banReason?: string;
    banExpiry?: string;
}

export default function BanIndicator({ isBanned, banReason, banExpiry }: BanIndicatorProps) {
    if (!isBanned) return null;

    const formatExpiry = (isoString?: string) => {
        if (!isoString) return 'Навсегда';
        const date = new Date(isoString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="ban-indicator">
            <div className="ban-header">
                <IconBan size={20} />
                <span>Аккаунт заблокирован</span>
            </div>
            {banReason && (
                <p className="ban-reason">{banReason}</p>
            )}
            <div className="ban-expiry">
                <IconClock size={14} />
                <span>{banExpiry ? `До ${formatExpiry(banExpiry)}` : 'Навсегда'}</span>
            </div>
        </div>
    );
}
