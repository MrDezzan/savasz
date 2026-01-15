'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validateSession } from '@/lib/api';

export default function Navbar() {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('sylvaire_token');
        if (token) {
            validateSession(token).then((data) => {
                if (data.valid && data.username) {
                    setUser({ username: data.username });
                } else {
                    localStorage.removeItem('sylvaire_token');
                    localStorage.removeItem('sylvaire_username');
                }
            });
        }
    }, []);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 5000);
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link href="/" className="nav-logo">
                        <img src="/assets/logo.png" alt="Sylvaire" className="w-10 h-10 object-contain" />
                    </Link>
                    <div className="nav-links">
                        <Link href="/leaderboard" className="nav-link">◈ Статистика</Link>
                        <a href="https://shop.sylvaire.ru" className="nav-link">◇ Магазин</a>
                        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); showNotification('📖 Вики пока недоступно. Следите за обновлениями в Discord!'); }}>◈ Вики</a>
                        <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); showNotification('🗺️ Карта пока недоступна. Следите за обновлениями в Discord!'); }}>◇ Карта</a>
                    </div>
                    {user ? (
                        <Link href={`/profile/${user.username}`} className="nav-btn">
                            {user.username}
                        </Link>
                    ) : (
                        <Link href="/login" className="nav-btn">Войти</Link>
                    )}
                </div>
            </nav>

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
