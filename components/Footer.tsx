import Link from 'next/link';
import { config } from '@/lib/config';

export default function Footer() {
    return (
        <footer className="bg-slate-900/50 border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" strokeLinejoin="round" />
                            </svg>
                            Sylvaire
                        </Link>
                        <p className="text-slate-400 text-sm">
                            Уникальный Minecraft сервер с политической ролевой игрой
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Навигация</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">Главная</Link>
                            <Link href="/leaderboard" className="text-slate-400 hover:text-white text-sm transition-colors">Статистика</Link>
                            <Link href="/feed" className="text-slate-400 hover:text-white text-sm transition-colors">Лента</Link>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Сообщество</h4>
                        <div className="flex flex-col gap-2">
                            <a href={config.discordUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">Discord</a>
                            <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">Telegram</a>
                            <a href={config.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">YouTube</a>
                        </div>
                    </div>

                    {/* Server */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Сервер</h4>
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <p className="text-slate-400 text-sm mb-2">IP-адрес:</p>
                            <code className="text-indigo-400 font-mono text-lg">{config.serverIp}</code>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Sylvaire. Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}
