import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="forum-layout">
            <Sidebar />
            <main className="forum-content">
                {children}
            </main>
        </div>
    );
}
