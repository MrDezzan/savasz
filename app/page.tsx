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
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-version">
            <span>🎮 Версия 1.21</span>
          </div>
          <h1 className="hero-title">
            Sylvaire
          </h1>
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
  );
}
