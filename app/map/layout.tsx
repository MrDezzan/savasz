import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="forum-layout">
            <Sidebar />
            <main className="forum-content">
                <Breadcrumbs />
                {children}
            </main>
        </div>
    );
}
