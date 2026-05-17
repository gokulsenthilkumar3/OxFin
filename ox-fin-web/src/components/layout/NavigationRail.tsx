'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Wallet,
    PieChart,
    CreditCard,
    Settings,
    Receipt,
    LogOut
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wallets', href: '/wallets', icon: Wallet },
    { name: 'Investments', href: '/investments', icon: PieChart },
    { name: 'Cards', href: '/cards', icon: CreditCard },
    { name: 'Bills', href: '/bills', icon: Receipt },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function NavigationRail() {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (pathname === '/') return null;

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-black/40 backdrop-blur-3xl border-r border-white/10 flex flex-col items-center py-6 z-50">
            {/* Logo */}
            <div className="mb-10 w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                O
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                                    : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                            title={item.name}
                        >
                            <item.icon size={22} strokeWidth={2} />
                            {isActive && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Logout */}
            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="mt-auto w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
                title={`Sign out (${session?.user?.name || 'User'})`}
            >
                {session?.user?.image ? (
                    <img src={session.user.image} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <LogOut size={20} />
                )}
            </button>
        </aside>
    );
}
