'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

            <div className="text-center animate-fade-in z-10">
                <h1 className="text-[150px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-600 select-none drop-shadow-2xl">
                    404
                </h1>
                <h2 className="text-3xl font-bold text-white mb-4">
                    Страница не найдена
                </h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                    Похоже, вы забрели в неизведанные земли. Эта страница не существует или была перемещена.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-10 py-4 text-lg bg-[#0F172A] text-white border border-indigo-500/30 rounded-md font-semibold hover:bg-indigo-900/40 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/10 mt-8"
                >
                    <span>Вернуться домой</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
    );
}
