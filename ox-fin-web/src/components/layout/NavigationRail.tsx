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

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-surface border-r border-border flex flex-col items-center py-6 z-50 shadow-sm">
            {/* Logo */}
            <div className="mb-10 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
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
                                "flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            )}
                            title={item.name}
                        >
                            <item.icon size={22} strokeWidth={2} />
                            {isActive && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
                className="mt-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
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
