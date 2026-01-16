'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();
    const [state, setState] = useState<'username' | 'code' | 'success' | 'denied'>('username');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(300);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/forum');
        }
    }, [user, router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state === 'code' && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [state, countdown]);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${config.apiUrl}/api/auth/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();

            if (data.success) {
                setState('code');
                setCountdown(300);
            } else {
                setError(data.error || 'Не удалось отправить код');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${config.apiUrl}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, code })
            });
            const data = await res.json();

            if (data.success) {
                // Use auth context login function
                login(data.token, username);
                setState('success');
                setTimeout(() => {
                    router.push('/forum');
                }, 1500);
            } else {
                if (data.denied) {
                    setState('denied');
                } else {
                    setError(data.error || 'Неверный код');
                }
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="login-section">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link href="/" className="login-logo">
                            <img src="/assets/logo.png" alt="Sylvaire" />
                        </Link>
                        <h1>Вход в аккаунт</h1>
                        <p>Авторизуйтесь через Discord для доступа к сайту</p>
                    </div>

                    {state === 'username' && (
                        <form className="login-form" onSubmit={handleRequestCode}>
                            <div className="form-group">
                                <label htmlFor="username">Никнейм в Minecraft</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ваш игровой ник"
                                    required
                                    minLength={3}
                                    maxLength={16}
                                    autoComplete="off"
                                />
                            </div>
                            {error && <div className="form-error">{error}</div>}
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? 'Отправка...' : 'Получить код →'}
                            </button>
                            <p className="login-hint">
                                💡 Код будет отправлен в личные сообщения Discord-бота
                            </p>
                        </form>
                    )}

                    {state === 'code' && (
                        <form className="login-form" onSubmit={handleVerifyCode}>
                            <div className="code-info">
                                <p>Код отправлен игроку <strong>{username}</strong></p>
                                <p className="countdown">Код действителен: {formatTime(countdown)}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="code">6-значный код</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    required
                                    pattern="\d{6}"
                                    autoComplete="off"
                                    className="code-input"
                                />
                            </div>
                            {error && <div className="form-error">{error}</div>}
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading || code.length !== 6}>
                                {loading ? 'Проверка...' : 'Подтвердить'}
                            </button>
                            <button type="button" className="btn btn-secondary btn-block" onClick={() => setState('username')}>
                                ← Назад
                            </button>
                        </form>
                    )}

                    {state === 'success' && (
                        <div className="login-success">
                            <div className="success-icon">✓</div>
                            <h2>Добро пожаловать!</h2>
                            <p>Вы успешно авторизовались как <strong>{username}</strong></p>
                            <p className="redirect-text">Перенаправление...</p>
                        </div>
                    )}

                    {state === 'denied' && (
                        <div className="login-denied">
                            <div className="denied-icon">✕</div>
                            <h2>Доступ запрещён</h2>
                            <p>Авторизация была отклонена в Discord.</p>
                            <button className="btn btn-secondary btn-block" onClick={() => setState('username')}>
                                Попробовать снова
                            </button>
                        </div>
                    )}
                </div>

                <div className="login-footer">
                    <p>Ещё не на сервере? <a href="https://dsc.gg/sylvaire">Присоединяйтесь к Discord</a></p>
                </div>
            </div>
        </section>
    );
}
