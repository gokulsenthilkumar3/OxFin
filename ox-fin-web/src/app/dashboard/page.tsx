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

const QuickAction = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
    <button className="flex flex-col items-center gap-2 group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg shadow-blue-500/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
            <Icon size={24} strokeWidth={2} />
        </div>
        <span className="text-xs font-medium text-slate-600 group-hover:text-primary transition-colors">{label}</span>
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
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
            {/* Header Section with Search */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1">Good morning, {session?.user?.name || 'Agent'}</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-72">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50 focus:bg-white text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Button variant="ghost" className="bg-white border-2 border-slate-100 text-slate-600 h-12">
                        <Download size={18} className="mr-2" />
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        className="shadow-xl shadow-blue-500/20 h-12"
                        onClick={() => setIsTransferModalOpen(true)}
                    >
                        <Zap size={18} className="mr-2" />
                        New Transfer
                    </Button>
                </div>
            </header>

            {/* Smart Insights & Wallet Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Left Column: Cards & Actions */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Smart Insight */}
                    <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 text-blue-900">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                            <Zap size={22} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-900">Smart Insight</p>
                            <p className="text-sm text-blue-700/80 leading-relaxed">You spent <span className="font-extrabold">10% less</span> on groceries this week compared to last month. Keep it up!</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between px-2 pt-2">
                        <QuickAction icon={Send} label="Send" color="bg-blue-600" />
                        <QuickAction icon={ArrowDownRight} label="Request" color="bg-emerald-500" />
                        <QuickAction icon={FileText} label="Pay Bill" color="bg-purple-500" />
                        <QuickAction icon={CreditCard} label="Cards" color="bg-slate-800" />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-swiss p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900">Income vs Expense</h3>
                                <button className="text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
                            </div>
                            <TransactionTrendChart />
                        </div>
                        <div className="card-swiss p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900">Spending</h3>
                                <button className="text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
                            </div>
                            <SpendingPieChart />
                        </div>
                    </div>
                </div>

                {/* Right Column: Wallet & Transactions */}
                <div className="space-y-10">
                    {loading ? (
                        <div className="card-swiss p-8 h-[240px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
                            <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
                            <Link href="/transactions" className="text-sm text-primary font-medium hover:underline">View All</Link>
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
                                            <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform`}>
                                                {txn.description.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{txn.description}</p>
                                                <p className="text-xs text-slate-400">{new Date(txn.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${parseFloat(txn.amount) > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {parseFloat(txn.amount) > 0 ? '+' : ''}${Math.abs(parseFloat(txn.amount)).toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">No transactions found.</p>
                            )}
                        </div>
                    </div>

                    {/* Mini Portfolio */}
                    <div className="card-swiss p-6 bg-slate-900 text-white border-none">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-slate-400">Total Portfolio</p>
                            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                <ArrowUpRight size={12} /> +12.5%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-6">
                            {loading ? '...' : `$${(balanceData?.totalBalance || 0 + 114443).toLocaleString()}`}
                        </h3>
                        <div className="h-24">
                            <PortfolioChart />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations "For You" */}
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

