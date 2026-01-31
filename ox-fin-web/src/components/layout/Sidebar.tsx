'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Receipt,
    CreditCard,
    Settings,
    Menu,
    X
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-elevated text-foreground"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-screen w-64 bg-surface border-r border-ox-blue-800 transition-transform duration-300 z-30',
                    'lg:translate-x-0',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="mb-8 mt-4">
                        <h1 className="text-2xl font-bold gradient-text">
                            OxFin
                            <span className="ml-2 text-accent">ரூ</span>
                        </h1>
                        <p className="text-xs text-foreground-muted mt-1">Global Finance Super App</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="pt-4 border-t border-ox-blue-800">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                U
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">User</p>
                                <p className="text-xs text-foreground-muted">Premium Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
