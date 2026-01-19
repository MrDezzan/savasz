'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
    IconHome,
    IconBell,
    IconUser,
    IconTrophy,
    IconSettings,
    IconLogout,
    IconAlert,
    IconLogs,
    IconComment,
} from '@/components/ui/icons';

interface NavItem {
    href: string;
    icon: React.FC<{ size?: number; className?: string }>;
    label: string;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    showBadge?: boolean;
}

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();
    const [hasNotifications] = useState(false);

    const navItems: NavItem[] = [
        { href: '/forum', icon: IconComment, label: 'Форум' },

        { href: '/forum/leaderboard', icon: IconTrophy, label: 'Рейтинг' },
        { href: user ? `/profile/${user.username}` : '/login', icon: IconUser, label: 'Профиль' },
    ];

    // Кнопка логов только для админов
    const adminItems: NavItem[] = [
        { href: '/admin/logs', icon: IconLogs, label: 'Логи', requiresAdmin: true },
    ];

    const isActive = (href: string) => {
        if (href === '/forum') return pathname === '/forum';
        if (href === '/forum/leaderboard') return pathname === '/forum/leaderboard';

        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-content">
                    {/* Logo - всегда ведёт на главную внешнюю страницу */}
                    <Link href="/" className="sidebar-logo">
                        <img src="/assets/logo.png" alt="Sylvaire" />
                    </Link>

                    {/* Navigation */}
                    <nav className="sidebar-nav">
                        {navItems.map((item) => {
                            if (item.requiresAuth && !user) return null;

                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-item ${active ? 'active' : ''}`}
                                    title={item.label}
                                >
                                    <Icon size={24} />
                                    {item.showBadge && (
                                        <span className="sidebar-badge">
                                            <IconAlert size={10} />
                                        </span>
                                    )}
                                    <span className="sidebar-tooltip">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Admin items */}
                        {isAdmin && adminItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-item admin-item ${active ? 'active' : ''}`}
                                    title={item.label}
                                >
                                    <Icon size={24} />
                                    <span className="sidebar-tooltip">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom actions */}
                    <div className="sidebar-bottom">
                        {user ? (
                            <button
                                onClick={logout}
                                className="sidebar-item sidebar-logout"
                                title="Выйти"
                            >
                                <IconLogout size={24} />
                                <span className="sidebar-tooltip">Выйти</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className={`sidebar-item ${pathname === '/login' ? 'active' : ''}`}
                                title="Войти"
                            >
                                <IconUser size={24} />
                                <span className="sidebar-tooltip">Войти</span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                {navItems.slice(0, 5).map((item) => {
                    if (item.requiresAuth && !user) return null;

                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-item ${active ? 'active' : ''}`}
                        >
                            <Icon size={22} />
                            {item.showBadge && <span className="mobile-nav-badge" />}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
