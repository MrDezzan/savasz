'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestAuth, verifyAuth, validateSession } from '@/lib/api';

type Step = 'username' | 'code' | 'success' | 'denied';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('username');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300);

    // Check existing session
    useEffect(() => {
        const token = localStorage.getItem('sylvaire_token');
        if (token) {
            validateSession(token).then((data) => {
                if (data.valid) {
                    router.push('/feed');
                }
            });
        }
    }, [router]);

    // Countdown timer
    useEffect(() => {
        if (step === 'code' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [step, countdown]);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError('');

        const result = await requestAuth(username.trim());

        if (result.success) {
            setStep('code');
            setCountdown(300);
        } else {
            setError(result.error || 'Ошибка');
        }
        setLoading(false);
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError('');

        const result = await verifyAuth(username, code.trim());

        if (result.success && result.token) {
            localStorage.setItem('sylvaire_token', result.token);
            localStorage.setItem('sylvaire_username', username);
            setStep('success');
            setTimeout(() => router.push('/feed'), 1500);
        } else if (result.denied) {
            setStep('denied');
        } else {
            setError(result.error || 'Неверный код');
        }
        setLoading(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="w-full max-w-md mx-4">
                <div className="glass rounded-3xl p-8">
                    {/* Username Step */}
                    {step === 'username' && (
                        <form onSubmit={handleRequestCode} className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-white text-center mb-2">Вход в аккаунт</h1>
                            <p className="text-slate-400 text-center mb-8">
                                Введите ваш никнейм на сервере
                            </p>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ваш никнейм"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-4"
                                autoFocus
                            />

                            {error && (
                                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !username.trim()}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Отправка...' : 'Продолжить'}
                            </button>

                            <p className="text-slate-500 text-sm text-center mt-6">
                                Код будет отправлен в Discord DM
                            </p>
                        </form>
                    )}

                    {/* Code Step */}
                    {step === 'code' && (
                        <form onSubmit={handleVerifyCode} className="animate-fade-in">
                            <h1 className="text-2xl font-bold text-white text-center mb-2">Введите код</h1>
                            <p className="text-slate-400 text-center mb-6">
                                Мы отправили 6-значный код в Discord
                            </p>

                            <div className="flex justify-center mb-6">
                                <span className={`text-lg font-mono ${countdown < 60 ? 'text-red-400' : 'text-slate-400'}`}>
                                    {formatTime(countdown)}
                                </span>
                            </div>

                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-slate-600 focus:border-indigo-500 focus:outline-none mb-4"
                                maxLength={6}
                                autoFocus
                            />

                            {error && (
                                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || code.length !== 6}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Проверка...' : 'Войти'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('username')}
                                className="w-full mt-3 text-slate-400 hover:text-white text-sm"
                            >
                                ← Другой никнейм
                            </button>
                        </form>
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <div className="text-center animate-fade-in">
                            <div className="text-6xl mb-4">✅</div>
                            <h1 className="text-2xl font-bold text-white mb-2">Успешный вход!</h1>
                            <p className="text-slate-400">Перенаправление...</p>
                        </div>
                    )}

                    {/* Denied Step */}
                    {step === 'denied' && (
                        <div className="text-center animate-fade-in">
                            <div className="text-6xl mb-4">🚫</div>
                            <h1 className="text-2xl font-bold text-white mb-2">Вход заблокирован</h1>
                            <p className="text-slate-400 mb-6">
                                Владелец аккаунта отклонил попытку входа
                            </p>
                            <button
                                onClick={() => {
                                    setStep('username');
                                    setCode('');
                                    setError('');
                                }}
                                className="btn-secondary"
                            >
                                Попробовать снова
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
