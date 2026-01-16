'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getServerStats, ServerStats } from '@/lib/api';

export default function LandingPage() {
  const [stats, setStats] = useState<ServerStats | null>(null);

  useEffect(() => {
    getServerStats().then(setStats).catch(() => { });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-version">
              <span>🎮 Версия 1.21</span>
            </div>
            <h1 className="hero-title">Sylvaire</h1>
            <p className="hero-desc">
              Присоединяйся к сообществу игроков. Строй, исследуй и создавай историю вместе с нами.
            </p>
            <div className="hero-btns">
              <a href="#join" className="btn primary">
                Начать игру
              </a>
              <Link href="/leaderboard" className="btn secondary">
                Лидерборд
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-num">{stats?.online ?? '—'}</span>
              <span className="stat-label">Онлайн</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats?.totalPlayers ?? '—'}</span>
              <span className="stat-label">Всего игроков</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">1.21</span>
              <span className="stat-label">Версия</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Аптайм</span>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="banner">
        <h2 className="banner-title">Особенности сервера</h2>
        <p className="banner-text">
          Дружелюбное сообщество, система альянсов, рейтинг игроков и уникальные постройки
        </p>
      </section>

      {/* Reviews / Features */}
      <section className="section">
        <div className="container">
          <div className="reviews-row">
            <div className="review">
              <div className="review-top">
                <div className="review-avatar">👥</div>
                <div className="review-info">
                  <h4>Сообщество</h4>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Дружелюбное комьюнити и система альянсов для объединения игроков</p>
            </div>
            <div className="review">
              <div className="review-top">
                <div className="review-avatar">🏆</div>
                <div className="review-info">
                  <h4>Рейтинг</h4>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Таблица лидеров и подробная статистика каждого игрока</p>
            </div>
            <div className="review">
              <div className="review-top">
                <div className="review-avatar">🏗️</div>
                <div className="review-info">
                  <h4>Постройки</h4>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Создавай масштабные проекты вместе с другими игроками</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Join Section */}
      <section id="join" className="cta">
        <div className="cta-icon">🎮</div>
        <h2 className="cta-title">Присоединяйся к серверу</h2>
        <p className="cta-text">Скопируй IP-адрес и начни играть прямо сейчас</p>
        <div className="cta-buttons">
          <button
            className="btn primary btn-lg"
            onClick={() => navigator.clipboard.writeText('sylvaire.ru')}
          >
            Копировать IP: sylvaire.ru
          </button>
          <a href="https://discord.gg/sylvaire" target="_blank" rel="noopener" className="btn secondary btn-lg">
            Discord
          </a>
        </div>
        <p className="cta-note">Java Edition • Версия 1.21</p>
      </section>

      {/* Social Links */}
      <section className="section">
        <div className="container">
          <div className="faq-grid">
            <div className="links-col">
              <h2 className="faq-title">Полезные ссылки</h2>
              <div className="links-grid">
                <Link href="/leaderboard" className="link-card">
                  <div className="link-icon">📊</div>
                  <div className="link-info">
                    <span className="link-name">Лидерборд</span>
                    <span className="link-desc">Топ игроков по времени</span>
                  </div>
                </Link>
                <Link href="/alliances" className="link-card">
                  <div className="link-icon">🛡️</div>
                  <div className="link-info">
                    <span className="link-name">Альянсы</span>
                    <span className="link-desc">Сообщества игроков</span>
                  </div>
                </Link>
                <a href="https://discord.gg/sylvaire" target="_blank" rel="noopener" className="link-card">
                  <div className="link-icon">💬</div>
                  <div className="link-info">
                    <span className="link-name">Discord</span>
                    <span className="link-desc">Наш сервер общения</span>
                  </div>
                </a>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>
    </>
  );
}
