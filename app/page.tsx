'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getServerStats, ServerStats } from '@/lib/api';

export default function LandingPage() {
  const [stats, setStats] = useState<ServerStats | null>(null);

  useEffect(() => {
    getServerStats().then(setStats);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Sylvaire</span>
            <span className="hero-subtitle-text">Minecraft Сервер</span>
          </h1>
          <p className="hero-description">
            Присоединяйся к сообществу игроков. Строй, исследуй и создавай историю вместе с нами.
          </p>
          <div className="hero-buttons">
            <a href="#join" className="btn btn-primary btn-lg">
              Начать игру
            </a>
            <Link href="/forum" className="btn btn-secondary btn-lg">
              Форум
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-frame">
            <img
              src="/hero-image.png"
              alt="Sylvaire Server"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid-landing">
          <div className="stat-card-landing">
            <div className="stat-value-landing">{stats?.online ?? '—'}</div>
            <div className="stat-label-landing">Онлайн</div>
          </div>
          <div className="stat-card-landing">
            <div className="stat-value-landing">{stats?.totalPlayers ?? '—'}</div>
            <div className="stat-label-landing">Всего игроков</div>
          </div>
          <div className="stat-card-landing">
            <div className="stat-value-landing">1.21</div>
            <div className="stat-label-landing">Версия</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Особенности сервера</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Сообщество</h3>
            <p>Дружелюбное комьюнити и альянсы игроков</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3>Рейтинг</h3>
            <p>Таблица лидеров и статистика игроков</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
              </svg>
            </div>
            <h3>Постройки</h3>
            <p>Создавай масштабные проекты с другими игроками</p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="join-section">
        <div className="join-card">
          <h2>Присоединяйся к серверу</h2>
          <p>Скопируй IP-адрес и начни играть прямо сейчас</p>
          <div className="server-ip">
            <code>sylvaire.ru</code>
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText('sylvaire.ru')}
            >
              Копировать
            </button>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="links-section">
        <div className="links-grid">
          <Link href="/leaderboard" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 21V12H4v9h4zm6-7v7h4v-7h-4zm-2-3v10h-2V11h2z" />
              </svg>
            </div>
            <span>Лидерборд</span>
          </Link>
          <Link href="/forum" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
              </svg>
            </div>
            <span>Форум</span>
          </Link>
          <Link href="/alliances" className="link-card">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>Альянсы</span>
          </Link>
          <a href="https://discord.gg/sylvaire" target="_blank" rel="noopener" className="link-card discord">
            <div className="link-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02" />
              </svg>
            </div>
            <span>Discord</span>
          </a>
        </div>
      </section>
    </div>
  );
}
