import Sidebar from "@/components/Sidebar";

export default function ForumLayout({
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
