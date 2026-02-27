'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
    Loader2,
    Bell,
    TrendingUp,
    Activity,
} from 'lucide-react';
import TransferModal from '@/components/ui/TransferModal';

const StatCard = ({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) => (
    <div className="glass-card p-5 stat-card-accent">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
        <p className="text-2xl font-extrabold text-white tracking-tight mb-2">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {change}
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, label, color, onClick }: { icon: any; label: string; color: string; onClick?: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 group">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
            <Icon size={20} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
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
                setBalanceData(await balanceRes.json());
                setTransactions((await txRes.json()).transactions || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (session) fetchData(); }, [session]);

    const firstName = session?.user?.name?.split(' ')[0] || 'Agent';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            {/* ── Header ── */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
                <div>
                    <p className="text-sm text-slate-500 font-medium">{greeting} 👋</p>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                        {firstName}&apos;s Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search transactions…"
                            className="w-56 pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/8 transition-all"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/8 transition-all">
                        <Download size={15} /> Export
                    </button>
                    <button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Zap size={15} /> Transfer
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-white/8 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all relative">
                        <Bell size={16} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </button>
                </div>
            </header>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Balance" value={loading ? '—' : `$${(balanceData?.totalBalance || 0).toLocaleString()}`} change="+2.4% this week" positive />
                <StatCard label="Total Portfolio" value={loading ? '—' : `$${((balanceData?.totalBalance || 0) + 114443).toLocaleString()}`} change="+12.5% this month" positive />
                <StatCard label="Monthly Spend" value="$3,240" change="-8.1% vs last month" positive />
                <StatCard label="Savings Rate" value="34%" change="+5% vs last month" positive />
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Insight Banner */}
                    <div className="glass-card p-4 flex items-center gap-4 border-blue-500/20">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                            <Zap size={18} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Smart Insight</p>
                            <p className="text-sm text-slate-400 leading-relaxed">You spent <span className="text-white font-bold">10% less</span> on groceries this week. Great discipline!</p>
                        </div>
                        <Activity size={16} className="text-blue-400 ml-auto flex-shrink-0" />
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Quick Actions</p>
                        <div className="flex items-center justify-around">
                            <QuickAction icon={Send} label="Send" color="bg-blue-600 shadow-blue-500/20" onClick={() => setIsTransferModalOpen(true)} />
                            <QuickAction icon={ArrowDownRight} label="Request" color="bg-emerald-600 shadow-emerald-500/20" />
                            <QuickAction icon={FileText} label="Pay Bill" color="bg-violet-600 shadow-violet-500/20" />
                            <QuickAction icon={CreditCard} label="Cards" color="bg-slate-700 shadow-black/20" />
                            <QuickAction icon={TrendingUp} label="Invest" color="bg-amber-600 shadow-amber-500/20" />
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-white">Income vs Expense</h3>
                                <button className="text-slate-500 hover:text-slate-300 transition-colors"><MoreHorizontal size={18} /></button>
                            </div>
                            <TransactionTrendChart />
                        </div>
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-white">Spending</h3>
                                <button className="text-slate-500 hover:text-slate-300 transition-colors"><MoreHorizontal size={18} /></button>
                            </div>
                            <SpendingPieChart />
                        </div>
                    </div>
                </div>

                {/* Right 1/3 */}
                <div className="space-y-6">
                    {/* Card */}
                    {loading ? (
                        <div className="glass-card p-8 h-52 flex items-center justify-center">
                            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                        </div>
                    ) : (
                        <PhysicalCard
                            balance={balanceData?.totalBalance || 0}
                            cardHolder={session?.user?.name?.toUpperCase() || 'AGENT'}
                            expiry="09/29"
                        />
                    )}

                    {/* Portfolio Mini */}
                    <div className="glass-card p-5 stat-card-accent bg-gradient-to-br from-blue-950/40 to-indigo-950/30">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-slate-500 font-medium">Total Portfolio</p>
                            <span className="badge badge-success">+12.5%</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-white mb-4">
                            {loading ? '—' : `$${((balanceData?.totalBalance || 0) + 114443).toLocaleString()}`}
                        </h3>
                        <div className="h-20">
                            <PortfolioChart />
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                            <Link href="/wallets" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? Array(4).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full skeleton" />
                                        <div className="space-y-2">
                                            <div className="h-2.5 w-28 skeleton" />
                                            <div className="h-2 w-16 skeleton" />
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-14 skeleton" />
                                </div>
                            )) : transactions.length > 0 ? transactions.slice(0, 5).map((txn) => (
                                <div key={txn.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${parseFloat(txn.amount) > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                                            {txn.description.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200 leading-tight">{txn.description}</p>
                                            <p className="text-xs text-slate-500">{new Date(txn.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-semibold ${parseFloat(txn.amount) > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                        {parseFloat(txn.amount) > 0 ? '+' : ''}${Math.abs(parseFloat(txn.amount)).toFixed(2)}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 text-center py-4">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <AIRecommendations />

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
