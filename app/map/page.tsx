import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Карта сервера",
  description: "Интерактивная карта игрового мира сервера",
};

export default function MapPage() {
  const mapUrl = process.env.NEXT_PUBLIC_BLUEMAP_URL;
  const isMapAvailable = mapUrl && mapUrl.length > 0 && mapUrl !== "__NOT_CONFIGURED__";

  if (!isMapAvailable) {
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

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <iframe
        src={mapUrl}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          border: "none",
        }}
        allowFullScreen
        loading="lazy"
      />
      <style>{`
        html, body {
           overflow: hidden;
           height: 100%;
        }
      `}</style>
    </div>
  );
}
