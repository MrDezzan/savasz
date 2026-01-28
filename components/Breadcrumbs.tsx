'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeNames: Record<string, string> = {
    'participants': 'Участники',
    'map': 'Карта',
    'wiki': 'Вики',
    'forum': 'Форум',
    'profile': 'Профиль',
    'leaderboard': 'Лидерборд',
    'maintenance': 'Тех. работы',
    'login': 'Вход',
    'posts': 'Публикации',
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Split path and remove empty strings
    const segments = pathname.split('/').filter(Boolean);

    // If home or empty, don't show
    if (segments.length === 0) return null;

    // Generate crumbs
    const crumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;

        // Try to find readable name
        let name = routeNames[segment];

        // If not found, check if it's a number (ID) or username
        if (!name) {
            // Is it a number? (Post ID)
            if (/^\d+$/.test(segment)) {
                name = `#${segment}`;
            } else {
                // Assume it's a dynamic parameter (username, etc) -> Decode it
                try {
                    name = decodeURIComponent(segment);
                } catch {
                    name = segment;
                }
            }
        }

        return { name, href };
    });

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                <li>
                    <Link href="/">Главная</Link>
                </li>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={crumb.href} className={isLast ? 'active' : ''}>
                            <span className="separator">/</span>
                            {isLast ? (
                                <span aria-current="page">{crumb.name}</span>
                            ) : (
                                <Link href={crumb.href}>{crumb.name}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>

            <style jsx>{`
                .breadcrumbs {
                    margin-bottom: 24px;
                    color: #94a3b8;
                    font-size: 14px;
                    background: rgba(15, 23, 42, 0.4);
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(8px);
                    width: fit-content;
                }

                ol {
                    list-style: none;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    padding: 0;
                    margin: 0;
                }

                li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .separator {
                    color: #475569;
                    font-size: 12px;
                }

                a {
                    color: #cbd5e1;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                a:hover {
                    color: #60a5fa;
                }

                .active span {
                    color: #60a5fa;
                    font-weight: 500;
                }
            `}</style>
        </nav>
    );
}
