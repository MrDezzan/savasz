'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validateSession } from '@/lib/api';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const navLinks = [
        { href: '/', label: '🏠 Главная' },
        { href: '/leaderboard', label: '📊 Статистика' },
        { href: '/feed', label: '💬 Лента' },
        { href: '/orgs', label: '🏢 Организации' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" strokeLinejoin="round" />
                    </svg>
                    <span className="hidden sm:inline">Sylvaire</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${pathname === link.href
                                ? 'text-indigo-400'
                                : 'text-slate-300 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* User/Login */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                            <img
                                src={`https://mc-heads.net/avatar/${user.username}/32`}
                                alt=""
                                className="w-6 h-6 rounded"
                            />
                            <span className="text-sm font-medium text-white">{user.username}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            Войти
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900/95 border-b border-white/10">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`py-2 text-sm font-medium ${pathname === link.href ? 'text-indigo-400' : 'text-slate-300'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
