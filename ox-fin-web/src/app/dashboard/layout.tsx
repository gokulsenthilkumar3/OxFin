'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#050914]">
            <div className="ambient-bg" />
            <Sidebar />
            <main className="flex-1 lg:ml-64 relative z-10">
                {children}
            </main>
        </div>
    );
}
