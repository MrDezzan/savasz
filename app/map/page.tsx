'use client';

import Link from 'next/link';

export default function MapPage() {
    return (
        <div className="coming-soon-page">
            <div className="coming-soon-container">
                <div className="coming-soon-seal">
                    <div className="seal-icon">🗺️</div>
                    <div className="seal-border"></div>
                </div>
                <h1 className="coming-soon-title">Карта пока недоступна</h1>
                <p className="coming-soon-text">
                    Динамическая карта сервера появится в ближайшем обновлении. Следите за новостями!
                </p>
                <div className="coming-soon-actions">
                    <Link href="/" className="btn secondary">
                        ← На главную
                    </Link>
                    <a href="https://dsc.gg/sylvaire" target="_blank" rel="noopener" className="btn primary">
                        Discord
                    </a>
                </div>
            </div>
        </div>
    );
}
