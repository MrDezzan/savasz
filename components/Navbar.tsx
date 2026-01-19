'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
    IconHome,
    IconUser,
    IconTrophy,
    IconLogs,
    IconComment,
    IconLogout
} from '@/components/ui/icons';

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const [notification, setNotification] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 5000);
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link href="/" className="nav-logo">
                        <img src="/assets/logo.png" alt="Sylvaire" className="w-10 h-10 object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links">
                        <Link href="/forum" className="nav-link"><IconComment size={16} /> Форум</Link>
                        <Link href="/leaderboard" className="nav-link"><IconTrophy size={16} /> Статистика</Link>
                        <a href="https://shop.sylvaire.ru" className="nav-link"><IconHome size={16} /> Магазин</a>
                        <Link href="/wiki" className="nav-link"><IconLogs size={16} /> Вики</Link>
                        <Link href="/map" className="nav-link"><IconHome size={16} /> Карта</Link>
                    </div>

                    {/* Desktop Login Button */}
                    <div className="nav-auth-desktop">
                        {loading ? (
                            <div className="nav-btn" style={{ opacity: 0.5, cursor: 'default' }}>...</div>
                        ) : user ? (
                            <div className="nav-user-menu" style={{ position: 'relative' }}>
                                <button
                                    className="nav-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <img
                                        src={`https://mc-heads.net/avatar/${user.username}/24`}
                                        alt=""
                                        style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                                    />
                                    {user.username}
                                </button>
                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        right: 0,
                                        background: 'rgba(15, 23, 42, 0.98)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        minWidth: '160px',
                                        zIndex: 1000,
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
                                    }}>
                                        <Link
                                            href={`/profile/${user.username}`}
                                            className="nav-dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 14px',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <IconUser size={16} /> Мой профиль
                                        </Link>
                                        <Link
                                            href="/feed"
                                            className="nav-dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 14px',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <IconComment size={16} /> Лента
                                        </Link>
                                        <div style={{ height: '1px', background: 'rgba(99, 102, 241, 0.2)', margin: '8px 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                width: '100%',
                                                padding: '10px 14px',
                                                color: '#f87171',
                                                background: 'none',
                                                border: 'none',
                                                textAlign: 'left',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <IconLogout size={16} /> Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="nav-btn">Войти</Link>
                        )}
                    </div>

                    {/* Mobile: Login Button and Burger Menu */}
                    <div className="nav-mobile-actions">
                        {!loading && !user && (
                            <Link href="/login" className="nav-btn-mobile">Войти</Link>
                        )}
                        {!loading && user && (
                            <div className="nav-user-avatar-mobile">
                                <img
                                    src={`https://mc-heads.net/avatar/${user.username}/24`}
                                    alt={user.username}
                                    style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                        <button
                            className={`burger-menu ${mobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu} />

            {/* Mobile Menu Panel */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <Link href="/forum" className="mobile-nav-link" onClick={closeMobileMenu}>
                        <IconComment className="mobile-nav-icon" size={20} />
                        Форум
                    </Link>
                    <Link href="/leaderboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                        <IconTrophy className="mobile-nav-icon" size={20} />
                        Статистика
                    </Link>
                    <a href="https://shop.sylvaire.ru" className="mobile-nav-link" onClick={closeMobileMenu}>
                        <IconHome className="mobile-nav-icon" size={20} />
                        Магазин
                    </a>
                    <Link href="/wiki" className="mobile-nav-link" onClick={closeMobileMenu}>
                        <IconLogs className="mobile-nav-icon" size={20} />
                        Вики
                    </Link>
                    <Link href="/map" className="mobile-nav-link" onClick={closeMobileMenu}>
                        <IconHome className="mobile-nav-icon" size={20} />
                        Карта
                    </Link>

                    {user && (
                        <>
                            <div className="mobile-menu-divider" />
                            <Link href={`/profile/${user.username}`} className="mobile-nav-link" onClick={closeMobileMenu}>
                                <IconUser className="mobile-nav-icon" size={20} />
                                Мой профиль
                            </Link>
                            <Link href="/feed" className="mobile-nav-link" onClick={closeMobileMenu}>
                                <IconComment className="mobile-nav-icon" size={20} />
                                Лента
                            </Link>
                            <button
                                className="mobile-nav-link mobile-logout"
                                onClick={() => { handleLogout(); closeMobileMenu(); }}
                            >
                                <IconLogout className="mobile-nav-icon" size={20} />
                                Выйти
                            </button>
                        </>
                    )}
                </div>
            </div>

            {notification && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    zIndex: 10000,
                    animation: 'slideUp 0.4s ease',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    color: 'white',
                    fontSize: '14px'
                }}>
                    <p>{notification}</p>
                    <button
                        onClick={() => setNotification(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '0'
                        }}
                    >✕</button>
                    <style jsx>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}
