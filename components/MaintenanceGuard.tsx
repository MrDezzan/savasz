'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMaintenanceStatus } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();
    const [maintenance, setMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check maintenance status
        const checkStatus = async () => {
            try {
                const status = await getMaintenanceStatus();
                setMaintenance(status.maintenance);

                // Redirect logic
                if (status.maintenance) {
                    // Start redirecting if not on maintenance page, not login, and not api/static
                    if (pathname !== '/maintenance' && pathname !== '/login') {
                        // If user is logged in, we check if they are whitelisted (managed by API mostly, but client side check prevents flash)
                        // Actually API blocks requests, so client might fail.
                        // But here we just want to show the page.
                        // Ideally we trust the API 503 response too, but proactive check is better.

                        // We rely on API for whitelist check. If API returns 503, we redirect?
                        // But here we have global status.
                        // Simple logic: If maintenance && !user -> Redirect.
                        // If maintenance && user -> Let them try (API handles permission).
                        if (!user && !authLoading) {
                            router.push('/maintenance');
                        }
                    }
                } else {
                    if (pathname === '/maintenance') {
                        router.push('/');
                    }
                }
            } catch (e) {
                console.error("Failed to check maintenance", e);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();

        // Periodic check (every 30s)
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [pathname, router, user, authLoading]);

    // If on maintenance page, valid.
    // If loading, show children? or Spinner? 
    // Show children to avoid blocking initial render too much, let redirect happen.
    return <>{children}</>;
}
