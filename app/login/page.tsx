'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';

export default function LoginPage() {
    const router = useRouter();
    const [state, setState] = useState<'username' | 'code' | 'success' | 'denied'>('username');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(300);

    useEffect(() => {
        // Check if already logged in
        const token = localStorage.getItem('sylvaire_token');
        if (token) {
            fetch(`${config.apiUrl}/api/auth/session`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()).then(data => {
                if (data.success && data.valid) {
                    router.push('/feed');
                }
            }).catch(() => { });
        }
    }, [router]);

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
                localStorage.setItem('sylvaire_token', data.token);
                localStorage.setItem('sylvaire_username', username);
                setState('success');
                setTimeout(() => {
                    router.push('/feed');
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

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="login-page">
            <div className="login-card">
                {state === 'username' && (
                    <div id="state-username" className="auth-state active">
                        <div className="login-icon">🔐</div>
                        <h1 className="login-title">Вход в аккаунт</h1>
                        <p className="login-subtitle">
                            Введите ваш игровой никнейм и мы отправим код подтверждения в Discord
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleRequestCode}>
                            <div className="input-group">
                                <label className="input-label" htmlFor="username">Никнейм в Minecraft</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="input-field"
                                    placeholder="Например: Steve"
                                    required
                                    minLength={3}
                                    maxLength={16}
                                    autoComplete="off"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Получить код'}
                            </button>
                        </form>

                        <div className="login-steps">
                            <div className="steps-title">Как это работает?</div>
                            <div className="step">
                                <span className="step-number">1</span>
                                <span className="step-text">Введите никнейм, которым вы играете на сервере</span>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <span className="step-text">Мы отправим 6-значный код в Discord сообщением</span>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span className="step-text">Введите код на сайте и войдите в аккаунт</span>
                            </div>
                        </div>
                    </div>
                )}

                {state === 'code' && (
                    <div id="state-code" className="auth-state active">
                        <div className="login-icon">💬</div>
                        <h1 className="login-title">Проверьте Discord</h1>
                        <p className="login-subtitle">
                            Мы отправили 6-значный код в личные сообщения Discord. Введите его ниже:
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleVerifyCode}>
                            <div className="input-group">
                                <label className="input-label" htmlFor="code">Код подтверждения</label>
                                <input
                                    type="text"
                                    id="code"
                                    className="input-field code-input"
                                    placeholder="000000"
                                    required
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Подтвердить'}
                            </button>
                        </form>

                        <p className="countdown">Код действителен ещё <strong>{formatCountdown(countdown)}</strong></p>

                        <p className="back-to-login">
                            <button onClick={() => setState('username')} style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '14px' }}>
                                ← Ввести другой никнейм
                            </button>
                        </p>
                    </div>
                )}

                {state === 'success' && (
                    <div id="state-success" className="auth-state active">
                        <div className="success-icon">✅</div>
                        <h1 className="login-title">Добро пожаловать!</h1>
                        <p className="login-subtitle">
                            Вы успешно вошли в аккаунт. Перенаправление...
                        </p>
                    </div>
                )}

                {state === 'denied' && (
                    <div id="state-denied" className="auth-state active">
                        <div className="success-icon">🚫</div>
                        <h1 className="login-title">Доступ запрещён</h1>
                        <p className="login-subtitle">
                            Владелец аккаунта отклонил эту попытку входа. Если это были вы, попробуйте ещё раз.
                        </p>
                        <button className="login-btn" onClick={() => setState('username')}>Попробовать снова</button>
                    </div>
                )}
            </div>
        </section>
    );
}
