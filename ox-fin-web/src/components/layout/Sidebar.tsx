'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Receipt,
    CreditCard,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wallets', href: '/wallets', icon: Wallet },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Bills', href: '/bills', icon: Receipt },
    { name: 'Cards', href: '/cards', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const initials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'OX';

    const NavContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-7 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                        <span className="text-white font-extrabold text-base">O</span>
                    </div>
                    <div>
                        <span className="text-white font-extrabold text-lg tracking-tight leading-none">OxFin</span>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-widest">Finance Portal</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Main Menu</p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative',
                                isActive
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full" />
                            )}
                            <item.icon
                                size={18}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={cn(
                                    'flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                                    isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                                )}
                            />
                            <span className="font-medium text-sm flex-1">{item.name}</span>
                            {isActive && <ChevronRight size={14} className="text-blue-400/60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="px-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
                            {session?.user?.name || 'User'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                            {session?.user?.email || 'Premium Account'}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        title="Sign Out"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 shadow-xl"
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#080e1d] border-r border-white/5 z-30">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    'lg:hidden fixed left-0 top-0 h-screen w-64 bg-[#080e1d] border-r border-white/5 z-40 transition-transform duration-300',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <NavContent />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
