'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getServerStats, type ServerStats } from '@/lib/api';
import { config } from '@/lib/config';
import { formatPlaytime } from '@/lib/utils';

export default function HomePage() {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getServerStats().then(setStats).catch(console.error);
  }, []);

  const copyIp = () => {
    navigator.clipboard.writeText(config.serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-slate-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gradient">Sylvaire</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Политическая ролевая игра нового поколения. Создавай организации,
              участвуй в политике, меняй мир.
            </p>

            {/* Server IP */}
            <div className="inline-flex items-center gap-4 glass rounded-2xl px-6 py-4 mb-8">
              <div>
                <p className="text-sm text-slate-400 mb-1">IP-адрес сервера</p>
                <code className="text-2xl font-mono text-indigo-400">{config.serverIp}</code>
              </div>
              <button
                onClick={copyIp}
                className="px-4 py-2 bg-indigo-500/20 rounded-xl text-indigo-300 hover:bg-indigo-500/30 transition-colors"
              >
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>

            {/* Stats */}
            {stats && (
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.online}/{stats.max}</p>
                  <p className="text-sm text-slate-400">Онлайн</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.totalPlayers}</p>
                  <p className="text-sm text-slate-400">Игроков</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{formatPlaytime(stats.totalPlaytime)}</p>
                  <p className="text-sm text-slate-400">Наиграно</p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-4">
              <a href={config.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Discord сервер
              </a>
              <Link href="/leaderboard" className="btn-secondary">
                Статистика игроков
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Почему <span className="text-gradient">Sylvaire</span>?
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Unique experience that you won&apos;t find anywhere else
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                🏛️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Политика</h3>
              <p className="text-slate-400">
                Создавай партии, участвуй в выборах, влияй на законы сервера
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Организации</h3>
              <p className="text-slate-400">
                Создавай компании, банки, армии. Управляй ресурсами и людьми
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Сообщество</h3>
              <p className="text-slate-400">
                Веди блог, общайся с игроками, создавай альянсы
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="glass rounded-3xl p-12 max-w-3xl mx-auto animate-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готов начать?
            </h2>
            <p className="text-slate-300 mb-8">
              Присоединяйся к нашему Discord-серверу, чтобы подать заявку и начать игру
            </p>
            <a href={config.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg px-8 py-4">
              Присоединиться к Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
