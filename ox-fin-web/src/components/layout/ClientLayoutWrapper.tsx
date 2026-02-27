'use client';
import { usePathname } from 'next/navigation';
import NavigationRail from './NavigationRail';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/register';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {!isAuthPage && <NavigationRail />}
            <main className={`flex-1 transition-all duration-300 ${!isAuthPage ? 'pl-20' : ''}`}>
                {children}
            </main>
        </div>
    );
}
