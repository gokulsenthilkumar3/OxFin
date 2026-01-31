'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Wallet, Lock, Unlock, TrendingUp, Info, Zap, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import PhysicalCard from '@/components/ui/PhysicalCard';
import OxCryptoConverter from '@/components/ui/OxCryptoConverter';
import { calculateDailyInterest, calculateWalletLiteLimit, formatUSD } from '@/lib/oxCrypto';
import { mockWallets, mockOxCrypto } from '@/lib/mockData';

export default function WalletsPage() {
    const { data: session } = useSession();
    const [pinFreeEnabled, setPinFreeEnabled] = useState(false);
    const [walletLiteLimit, setWalletLiteLimit] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [wallets, setWallets] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balanceRes, txRes, limit] = await Promise.all([
                    fetch('/api/user/balance'),
                    fetch('/api/user/transactions'),
                    calculateWalletLiteLimit()
                ]);

                if (balanceRes.ok && txRes.ok) {
                    const balanceData = await balanceRes.json();
                    const txData = await txRes.json();
                    setWallets(balanceData.wallets || []);
                    setTransactions(txData.transactions || []);
                }
                setWalletLiteLimit(limit);
            } catch (error) {
                console.error('Failed to fetch wallet data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    const oxFullWallet = wallets.find(w => w.type === 'full');
    const oxLiteWallet = wallets.find(w => w.type === 'lite');
    const dailyInterest = oxFullWallet ? calculateDailyInterest(parseFloat(oxFullWallet.balance)) : 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 pb-32">
            {/* Header */}
            <header className="mb-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Wallets</h1>
                <p className="text-slate-500 mt-1">Manage your Ox Wallet (Full) and Wallet Lite</p>
            </header>

            {/* Wallet Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ox Wallet (Full) */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="card-swiss p-8 h-[240px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={parseFloat(oxFullWallet?.balance || 0)}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="12/29"
                            variant="primary"
                        />
                    )}
                    <div className="card-swiss p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Wallet size={18} className="text-primary" />
                            <h3 className="font-semibold text-slate-900">Ox Wallet (Full)</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Interest Rate:</span>
                                <span className="font-semibold text-emerald-600">6.5% APY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Daily Interest:</span>
                                <span className="font-semibold text-slate-900">{formatUSD(dailyInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">KYC Status:</span>
                                <span className="text-emerald-600 font-medium">✓ Verified</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs text-slate-500 flex items-start gap-2">
                                <Info size={14} className="mt-0.5 flex-shrink-0" />
                                Earns 6.5% of regional Repo Rate. Unlimited transactions with full KYC.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wallet Lite */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="card-swiss p-8 h-[240px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={parseFloat(oxLiteWallet?.balance || 0)}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="12/29"
                            variant="dark"
                        />
                    )}
                    <div className="card-swiss p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-amber-500" />
                                <h3 className="font-semibold text-slate-900">Wallet Lite</h3>
                            </div>
                            <button
                                onClick={() => setPinFreeEnabled(!pinFreeEnabled)}
                                className="flex items-center gap-2 text-sm"
                            >
                                {pinFreeEnabled ? (
                                    <Unlock size={16} className="text-emerald-500" />
                                ) : (
                                    <Lock size={16} className="text-slate-400" />
                                )}
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Daily Limit (Gold-Pegged):</span>
                                <span className="font-semibold text-slate-900">
                                    {loading ? '...' : formatUSD(walletLiteLimit)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Today's Spending:</span>
                                <span className="font-semibold text-slate-900">{formatUSD(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">PIN-Free Payments:</span>
                                <span className={`font-medium ${pinFreeEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {pinFreeEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs text-slate-500 flex items-start gap-2">
                                <Info size={14} className="mt-0.5 flex-shrink-0" />
                                Daily limit equals current 1g gold price ({formatUSD(walletLiteLimit)}). Limited KYC required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ox Crypto Converter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <OxCryptoConverter />

                {/* Ox Crypto Balance */}
                <div className="card-swiss p-8 bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white border-none relative overflow-hidden group">
                    <div className="absolute inset-0 noise-overlay opacity-20" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 h-full">
                        <div className="text-center md:text-left">
                            <p className="text-xs font-bold text-amber-100 uppercase tracking-widest mb-1 opacity-80">Ox Crypto Assets</p>
                            <h2 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
                                <span className="text-amber-200">ரூ</span>
                                {mockOxCrypto.balance.toFixed(4)}
                            </h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-amber-100/90 font-medium">
                                <TrendingUp size={16} />
                                <span>≈ {formatUSD(mockOxCrypto.balance * 90)}</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl border border-white/20 shadow-2xl relative group-hover:scale-110 transition-transform duration-500">
                            <span className="relative z-10 text-amber-100 drop-shadow-lg">ரூ</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent animate-pulse" />
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/10 relative z-10">
                        <p className="text-[10px] text-amber-100/60 uppercase font-bold tracking-widest text-center md:text-left">
                            High-Yield Protocol Active: 1.2% Bonus Earned Today
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-swiss p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full skeleton" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 skeleton" />
                                        <div className="h-2 w-20 skeleton" />
                                    </div>
                                </div>
                                <div className="h-3 w-16 skeleton" />
                            </div>
                        ))
                    ) : transactions.length > 0 ? (
                        transactions.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${parseFloat(txn.amount) > 0 ? 'bg-emerald-100' : 'bg-slate-100'
                                        }`}>
                                        {parseFloat(txn.amount) > 0 ? (
                                            <ArrowDownRight size={20} className="text-emerald-600" />
                                        ) : (
                                            <ArrowUpRight size={20} className="text-slate-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{txn.description}</p>
                                        <p className="text-xs text-slate-500">{new Date(txn.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${parseFloat(txn.amount) > 0 ? 'text-emerald-600' : 'text-slate-900'
                                    }`}>
                                    {parseFloat(txn.amount) > 0 ? '+' : ''}{formatUSD(Math.abs(parseFloat(txn.amount)))}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No transactions found.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
