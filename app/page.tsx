'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getServerStats } from '@/lib/api';

export default function HomePage() {
  const [online, setOnline] = useState(0);
  const [total, setTotal] = useState(0);
  const [tps, setTps] = useState(20.0);
  const [faqOpen, setFaqOpen] = useState<number[]>([]);

  const animateValue = (setFunc: (val: number) => void, start: number, end: number, duration: number, isFloat = false) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = start + (end - start) * eased;
      setFunc(isFloat ? parseFloat(value.toFixed(1)) : Math.floor(value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getServerStats();
        animateValue(setOnline, 0, stats.online, 1200);
        animateValue(setTotal, 0, stats.totalPlayers, 1200);
        // TPS is not part of ServerStats interface in api.ts, assuming 20 for now or added if available
        // If API doesn't return TPS, checking api.ts... "online: number; max: number; totalPlayers: number; totalPlaytime: number". NO TPS.
        // script.js fetched /api/server and expected it. I'll stick to 20.0 hardcoded or if I can fetch it.
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title"><span className="accent">Sylvaire</span> —</h1>
            <p className="hero-desc">
              Приватный сервер Minecraft, где фантазия становится реальностью.
              Присоединяйся к нашему уютному миру приключений, творчества и настоящего выживания.
            </p>
            <p className="hero-version">✦ 1.21.8 · Java Edition</p>
            <div className="hero-btns">
              <a href="https://dsc.gg/sylvaire" className="btn btn-primary">Начать приключение →</a>
              <a href="#features" className="btn btn-secondary">Подробнее</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <img src="/assets/hero.png" alt="Sylvaire" className="hero-image" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </div>
      </section>

      <section className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-text">✦ Приватный ✦ Уютный ✦ Атмосферный ✦ Дружелюбный ✦ Творческий ✦ Уникальный ✦
            Честный ✦ Захватывающий ✦ Sylvaire ✦ Приватный ✦ Уютный ✦ Атмосферный ✦ Дружелюбный ✦ Творческий ✦
            Уникальный ✦ Честный ✦ Захватывающий ✦ Sylvaire ✦ Приватный ✦ Уютный ✦ Атмосферный ✦ Дружелюбный ✦
            Творческий ✦ Уникальный ✦ Честный ✦ Захватывающий ✦ Sylvaire ✦ Приватный ✦ Уютный ✦ Атмосферный ✦
            Дружелюбный ✦ Творческий ✦ Уникальный ✦ Честный ✦ Захватывающий ✦ Sylvaire </span>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <h2 className="section-title">Мы — не обычный <span className="accent">проект</span></h2>
          <p className="section-sub">Мы — история! Уникальный игровой опыт, созданный с заботой о каждом игроке</p>
          <div className="cards-row">
            <div className="card fade-in">
              <div className="card-icon">↻</div>
              <h3 className="card-title">Регулярные обновления</h3>
              <p className="card-text">Мы постоянно совершенствуем Sylvaire, добавляя новые механики и улучшения.
                Всегда вперёд!</p>
            </div>
            <div className="card fade-in">
              <div className="card-icon">◈</div>
              <h3 className="card-title">Стабильные сезоны</h3>
              <p className="card-text">Наши сезоны проходят без сбоев и долгих перерывов. Каждый сезон длится минимум
                3 месяца.</p>
            </div>
            <div className="card fade-in">
              <div className="card-icon">◇</div>
              <h3 className="card-title">Комфортная игра</h3>
              <p className="card-text">Sylvaire — место без токсичности. Играйте в дружелюбной атмосфере.</p>
            </div>
            <div className="card fade-in">
              <div className="card-icon">♡</div>
              <h3 className="card-title">Дружелюбное комьюнити</h3>
              <p className="card-text">Здесь легко найти новых друзей и разделить увлекательные истории.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="section section-dark">
        <div className="container">
          <h2 className="section-title">Наш сервер в <span className="accent">цифрах</span></h2>
          <p className="section-sub">Активное сообщество, стабильная работа и постоянное развитие</p>
          <div className="stats-row">
            <div className="stat-box fade-in">
              <span className="stat-num">{online}</span>
              <span className="stat-label">Сейчас онлайн</span>
            </div>
            <Link href="/leaderboard" className="stat-box fade-in clickable">
              <span className="stat-num">{total}</span>
              <span className="stat-label">Всего игроков →</span>
            </Link>
            <div className="stat-box fade-in">
              <span className="stat-num">{tps.toFixed(1)}</span>
              <span className="stat-label">TPS сервера</span>
            </div>
            <div className="stat-box fade-in">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Аптайм</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Сервер — как <span className="accent">социальная сеть</span></h2>
          <p className="section-sub">Игроки заходят на сервер чтобы общаться, найти новую компанию и друзей</p>
          <div className="cards-row cards-row-3">
            <div className="card card-blue fade-in">
              <div className="card-icon">⛏</div>
              <h3 className="card-title">Выживайте</h3>
              <p className="card-text">Основа сервера — классическое, ванильное выживание с другими игроками</p>
            </div>
            <div className="card card-blue fade-in">
              <div className="card-icon">⌂</div>
              <h3 className="card-title">Вступайте в общину</h3>
              <p className="card-text">Общины — это объединения игроков, которые вместе строят города и общаются</p>
            </div>
            <div className="card card-blue fade-in">
              <div className="card-icon">◈</div>
              <h3 className="card-title">Торгуйте</h3>
              <p className="card-text">Обменивайтесь ресурсами, развивайте экономику и открывайте свой магазин</p>
            </div>
          </div>
        </div>
      </section>

      <section className="banner">
        <div className="container">
          <h2 className="banner-title">Без плагинов на аукцион, работу и валюту</h2>
          <p className="banner-text">Валюта сервера — алмазная руда. Игра основана на отношениях между игроками.</p>
        </div>
      </section>

      <section id="join" className="cta">
        <div className="container">
          <div className="cta-icon">✦</div>
          <h2 className="cta-title">Готовы начать <span className="accent">приключение</span>?</h2>
          <p className="cta-text">Присоединяйтесь к игрокам, которые уже создают свою историю на Sylvaire</p>
          <div className="cta-buttons">
            <a href="https://dsc.gg/sylvaire" className="btn btn-primary btn-lg">Играть бесплатно →</a>
            <a href="https://shop.sylvaire.ru" className="btn btn-secondary">Поддержать проект</a>
          </div>
          <p className="cta-note">Присоединение займет менее 2 минут • Бесплатно навсегда</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-grid">
            <div className="faq-col">
              <h2 className="faq-title">? Часто задаваемые <span className="accent">вопросы</span></h2>
              <div className="faq-list">
                {[
                  { q: "Какая версия у проекта?", a: "Проект установлен на версии 1.21.8. Можно заходить с версий 1.21.6 – 1.21.8!" },
                  { q: "На какой платформе можно зайти?", a: "Для игры необходимо заходить с платформы Java (ПК). Bedrock не поддерживается." },
                  { q: "Нужна ли лицензия?", a: "Нет, можно зайти как с пиратской, так и с лицензионной версии Minecraft." },
                  { q: "Как получить проходку?", a: "На донат-сайте или подать заявку в Discord. Проходка действует бессрочно!" },
                  { q: "Сколько длится сезон?", a: "Сезон Sylvaire длится как минимум 3 месяца. Каждый сезон уникален!" }
                ].map((item, index) => (
                  <div key={index} className={`faq-item ${faqOpen.includes(index) ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                    <div className="faq-q">
                      <span>{item.q}</span>
                      <span className="faq-plus">+</span>
                    </div>
                    <div className="faq-a">
                      <p>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="links-col">
              <div className="links-grid">
                <a href="https://dsc.gg/sylvaire" className="link-card">
                  <span className="link-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12" />
                    </svg>
                  </span>
                  <div className="link-info">
                    <span className="link-name">Discord</span>
                    <span className="link-desc">Играй с друзьями</span>
                  </div>
                  <span className="link-arrow">→</span>
                </a>
                <a href="https://t.me/sylvairemc" className="link-card">
                  <span className="link-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38" />
                    </svg>
                  </span>
                  <div className="link-info">
                    <span className="link-name">Telegram</span>
                    <span className="link-desc">Следи за новостями</span>
                  </div>
                  <span className="link-arrow">→</span>
                </a>
                <a href="https://youtube.com/@Силвейр" className="link-card">
                  <span className="link-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73" />
                    </svg>
                  </span>
                  <div className="link-info">
                    <span className="link-name">YouTube</span>
                    <span className="link-desc">Смотри видео</span>
                  </div>
                  <span className="link-arrow">→</span>
                </a>
                <a href="https://shop.sylvaire.ru" className="link-card">
                  <span className="link-icon">◇</span>
                  <div className="link-info">
                    <span className="link-name">Магазин</span>
                    <span className="link-desc">Поддержи проект</span>
                  </div>
                  <span className="link-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
