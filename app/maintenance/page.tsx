'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function MaintenancePage() {
    const { login } = useAuth();

    return (
        <section className="maintenance-page">
            <div className="maintenance-container">
                <div className="maintenance-icon">🛠️</div>
                <h1 className="maintenance-title">Технические работы</h1>
                <p className="maintenance-desc">
                    В данный момент мы проводим плановое обновление серверов Sylvaire,
                    чтобы сделать игру еще лучше и интереснее.
                </p>
                <div className="maintenance-info">
                    <p>Пожалуйста, попробуйте зайти позже или следите за новостями в нашем Discord.</p>
                </div>

                <div className="maintenance-actions">
                    <a href="https://discord.gg/sylvaire" target="_blank" rel="noopener noreferrer" className="btn btn-discord">
                        Перейти в Discord
                    </a>
                    <Link href="/login" className="btn btn-secondary">
                        Войти (Для администраторов)
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .maintenance-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a; /* Slate 900 */
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
                    color: white;
                    padding: 24px;
                }

                .maintenance-container {
                    max-width: 600px;
                    width: 100%;
                    text-align: center;
                    background: rgba(30, 41, 59, 0.5); /* Slate 800/50 */
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    border-radius: 24px;
                    padding: 48px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .maintenance-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    animation: bounce 2s infinite;
                }

                .maintenance-title {
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 16px;
                    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .maintenance-desc {
                    font-size: 18px;
                    line-height: 1.6;
                    color: #94a3b8;
                    margin-bottom: 24px;
                }

                .maintenance-info {
                    padding: 16px;
                    background: rgba(15, 23, 42, 0.6);
                    border-radius: 12px;
                    margin-bottom: 32px;
                    font-size: 14px;
                    color: #cbd5e1;
                }

                .maintenance-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 15px;
                    transition: all 0.2s;
                    cursor: pointer;
                    text-decoration: none;
                    border: none;
                }

                .btn-discord {
                    background: #5865F2;
                    color: white;
                }

                .btn-discord:hover {
                    background: #4752c4;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </section>
    );
}
