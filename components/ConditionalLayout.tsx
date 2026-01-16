'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Pages that should show external navigation (Navbar + Footer)
const EXTERNAL_ROUTES = ['/', '/leaderboard', '/login', '/wiki', '/map'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current route is external
    const isExternalRoute = EXTERNAL_ROUTES.some(route =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (isExternalRoute) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-16">
                    {children}
                </main>
                <Footer />
            </>
        );
    }

    // Internal forum pages - no navbar/footer, just children (nested layouts handle Sidebar)
    return <>{children}</>;
}
