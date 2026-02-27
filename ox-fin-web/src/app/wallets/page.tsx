'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Wallet, Lock, Unlock, TrendingUp, Info, Zap, ArrowUpRight, ArrowDownRight, Loader2, ShieldCheck } from 'lucide-react';
import PhysicalCard from '@/components/ui/PhysicalCard';
import OxCryptoConverter from '@/components/ui/OxCryptoConverter';
import { calculateDailyInterest, calculateWalletLiteLimit, formatUSD } from '@/lib/oxCrypto';
import { mockOxCrypto } from '@/lib/mockData';

const InfoRow = ({ label, value, valueStyle = '' }: { label: string; value: string; valueStyle?: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`text-sm font-semibold ${valueStyle || 'text-slate-200'}`}>{value}</span>
    </div>
);

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
                    setWallets(balanceData.wallets || []);
                    setTransactions((await txRes.json()).transactions || []);
                }
                setWalletLiteLimit(limit);
            } catch (error) {
                console.error('Failed to fetch wallet data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (session) fetchData();
    }, [session]);

    const oxFullWallet = wallets.find(w => w.type === 'full');
    const oxLiteWallet = wallets.find(w => w.type === 'lite');
    const dailyInterest = oxFullWallet ? calculateDailyInterest(parseFloat(oxFullWallet.balance)) : 0;

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <header className="pt-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-1">Finance</p>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Wallets</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your Ox Wallet (Full) and Wallet Lite</p>
            </header>

            {/* Wallet Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ox Wallet Full */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="glass-card p-8 h-52 flex items-center justify-center">
                            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={parseFloat(oxFullWallet?.balance || 0)}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="12/29"
                            variant="primary"
                        />
                    )}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                                <Wallet size={15} className="text-blue-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Ox Wallet (Full)</h3>
                            <span className="ml-auto badge badge-success flex items-center gap-1">
                                <ShieldCheck size={10} /> KYC Verified
                            </span>
                        </div>
                        <div>
                            <InfoRow label="Interest Rate" value="6.5% APY" valueStyle="text-emerald-400" />
                            <InfoRow label="Daily Interest" value={formatUSD(dailyInterest)} />
                            <InfoRow label="Transaction Limit" value="Unlimited" />
                        </div>
                        <p className="text-xs text-slate-500 flex items-start gap-2 mt-4 pt-4 border-t border-white/5">
                            <Info size={13} className="mt-0.5 flex-shrink-0 text-slate-600" />
                            Earns 6.5% of regional Repo Rate. Unlimited transactions with full KYC verification.
                        </p>
                    </div>
                </div>

                {/* Wallet Lite */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="glass-card p-8 h-52 flex items-center justify-center">
                            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={parseFloat(oxLiteWallet?.balance || 0)}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="12/29"
                            variant="dark"
                        />
                    )}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                                <Zap size={15} className="text-amber-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Wallet Lite</h3>
                            <button
                                onClick={() => setPinFreeEnabled(!pinFreeEnabled)}
                                className="ml-auto flex items-center gap-1.5 text-xs font-medium transition-colors"
                                title={pinFreeEnabled ? 'Disable PIN-Free' : 'Enable PIN-Free'}
                            >
                                {pinFreeEnabled ? (
                                    <><Unlock size={14} className="text-emerald-400" /><span className="text-emerald-400">PIN-Free On</span></>
                                ) : (
                                    <><Lock size={14} className="text-slate-500" /><span className="text-slate-500">PIN-Free Off</span></>
                                )}
                            </button>
                        </div>
                        <div>
                            <InfoRow label="Daily Limit (Gold-Pegged)" value={loading ? '…' : formatUSD(walletLiteLimit)} />
                            <InfoRow label="Today's Spending" value={formatUSD(0)} />
                            <InfoRow label="PIN-Free Payments" value={pinFreeEnabled ? 'Enabled' : 'Disabled'} valueStyle={pinFreeEnabled ? 'text-emerald-400' : 'text-slate-500'} />
                        </div>
                        <p className="text-xs text-slate-500 flex items-start gap-2 mt-4 pt-4 border-t border-white/5">
                            <Info size={13} className="mt-0.5 flex-shrink-0 text-slate-600" />
                            Daily limit equals current 1g gold price. Limited KYC required.
                        </p>
                    </div>
                </div>
            </div>

            {/* Crypto Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OxCryptoConverter />

                <div className="glass-card p-6 bg-gradient-to-br from-amber-950/30 to-orange-950/20 border-amber-500/15 relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-amber-400/80 uppercase tracking-widest mb-1">Ox Crypto Assets</p>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-amber-300 text-xl font-bold">ரூ</span>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">{mockOxCrypto.balance.toFixed(4)}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-400/80 font-medium mb-6">
                            <TrendingUp size={14} />
                            <span>≈ {formatUSD(mockOxCrypto.balance * 90)} USD</span>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-6">
                            <span className="text-2xl text-amber-300">ரூ</span>
                        </div>
                        <div className="pt-4 border-t border-white/8">
                            <p className="text-[11px] text-amber-400/60 uppercase font-bold tracking-widest">
                                High-Yield Protocol Active · 1.2% Bonus Earned Today
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-5">Recent Transactions</h3>
                <div className="space-y-1">
                    {loading ? Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full skeleton" />
                                <div className="space-y-2"><div className="h-2.5 w-28 skeleton" /><div className="h-2 w-16 skeleton" /></div>
                            </div>
                            <div className="h-2.5 w-14 skeleton" />
                        </div>
                    )) : transactions.length > 0 ? transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${parseFloat(txn.amount) > 0 ? 'bg-emerald-500/15' : 'bg-slate-800'}`}>
                                    {parseFloat(txn.amount) > 0
                                        ? <ArrowDownRight size={16} className="text-emerald-400" />
                                        : <ArrowUpRight size={16} className="text-slate-400" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{txn.description}</p>
                                    <p className="text-xs text-slate-500">{new Date(txn.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`text-sm font-semibold ${parseFloat(txn.amount) > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {parseFloat(txn.amount) > 0 ? '+' : ''}{formatUSD(Math.abs(parseFloat(txn.amount)))}
                            </span>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-500 text-center py-6">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
