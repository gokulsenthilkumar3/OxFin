"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PhysicalCard from '@/components/ui/PhysicalCard';
import AIRecommendations from '@/components/ui/AIRecommendations';
import { PortfolioChart, SpendingPieChart, TransactionTrendChart } from '@/components/ui/Charts';
import {
    Send,
    Download,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    FileText,
    CreditCard,
    Loader2
} from 'lucide-react';
import TransferModal from '@/components/ui/TransferModal';

const QuickAction = ({ icon: Icon, label, colorClass }: { icon: any, label: string, colorClass: string }) => (
    <button className="flex flex-col items-center gap-2 group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} text-white shadow-lg transition-all duration-300 group-hover:scale-110 border border-white/10`}>
            <Icon size={24} strokeWidth={2} />
        </div>
        <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
    </button>
);

export default function Dashboard() {
    const { data: session } = useSession();
    const [balanceData, setBalanceData] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [balanceRes, txRes] = await Promise.all([
                fetch('/api/user/balance'),
                fetch('/api/user/transactions')
            ]);

            if (balanceRes.ok && txRes.ok) {
                const balance = await balanceRes.json();
                const tx = await txRes.json();
                setBalanceData(balance);
                setTransactions(tx.transactions || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32 relative z-10">
            {/* Background Ambient Orbs for Dashboard */}
            <div className="fixed top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-orb pointer-events-none -z-10" />
            <div className="fixed bottom-[10%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[120px] animate-orb-delayed pointer-events-none -z-10" />
            
            {/* Header Section with Search */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
                    <p className="text-white/60 mt-1">Good morning, {session?.user?.name || 'Agent'}</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-72">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all bg-white/5 focus:bg-white/10 text-sm text-white placeholder:text-white/30"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button className="glass-button-secondary px-4 h-12 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                        <Download size={18} /> Export
                    </button>
                    <button
                        className="glass-button px-5 h-12 rounded-2xl flex items-center gap-2 text-sm font-bold"
                        onClick={() => setIsTransferModalOpen(true)}
                    >
                        <Zap size={18} /> New Transfer
                    </button>
                </div>
            </header>

            {/* Smart Insights & Wallet Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Left Column: Cards & Actions */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Smart Insight */}
                    <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-blue-500/30 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Zap size={22} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Smart Insight</p>
                            <p className="text-sm text-white/70 leading-relaxed mt-0.5">You spent <span className="text-white font-bold">10% less</span> on groceries this week compared to last month. Keep it up!</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between px-2 pt-2">
                        <QuickAction icon={Send} label="Send" colorClass="bg-blue-600/80 shadow-blue-500/20" />
                        <QuickAction icon={ArrowDownRight} label="Request" colorClass="bg-emerald-500/80 shadow-emerald-500/20" />
                        <QuickAction icon={FileText} label="Pay Bill" colorClass="bg-purple-500/80 shadow-purple-500/20" />
                        <QuickAction icon={CreditCard} label="Cards" colorClass="bg-white/10 shadow-white/5" />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-swiss p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-white">Income vs Expense</h3>
                                <button title="More options" aria-label="More options" className="text-white/40 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                            </div>
                            <div className="opacity-90">
                                <TransactionTrendChart />
                            </div>
                        </div>
                        <div className="card-swiss p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-white">Spending</h3>
                                <button title="More options" aria-label="More options" className="text-white/40 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                            </div>
                            <div className="opacity-90">
                                <SpendingPieChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Wallet & Transactions */}
                <div className="space-y-10">
                    {loading ? (
                        <div className="card-swiss p-8 h-[240px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={balanceData?.totalBalance || 0}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="09/29"
                        />
                    )}

                    {/* Recent Transactions List */}
                    <div className="card-swiss p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-white">Recent Transactions</h3>
                            <Link href="/transactions" className="text-sm text-white/60 font-medium hover:text-white transition-colors">View All</Link>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-balance">
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
                                transactions.map((txn, idx) => (
                                    <div key={txn.id} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full bg-white/10 border border-white/5 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform text-white`}>
                                                {txn.description.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{txn.description}</p>
                                                <p className="text-xs text-white/50">{new Date(txn.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${parseFloat(txn.amount) > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                            {parseFloat(txn.amount) > 0 ? '+' : ''}${Math.abs(parseFloat(txn.amount)).toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-white/40 text-center py-4">No transactions found.</p>
                            )}
                        </div>
                    </div>

                    {/* Mini Portfolio */}
                    <div className="card-swiss p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-white/60">Total Portfolio</p>
                                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    <ArrowUpRight size={12} /> +12.5%
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">
                                {loading ? '...' : `$${(balanceData?.totalBalance || 0 + 114443).toLocaleString()}`}
                            </h3>
                            <div className="h-24 opacity-80">
                                <PortfolioChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations "For You" */}
            <div className="opacity-90">
                <AIRecommendations />
            </div>

            {/* Transfer Modal */}
            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                wallets={balanceData?.wallets || []}
                onSuccess={fetchData}
            />
        </div>
    );
}
