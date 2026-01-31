'use client';

import { TrendingUp, TrendingDown, Plus, MoreHorizontal } from 'lucide-react';
import { PortfolioChart, SpendingPieChart } from '@/components/ui/Charts';

export default function InvestmentsPage() {
    const holdings = [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, price: 182.52, change: 2.4, value: 4563.00 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, price: 140.93, change: -1.2, value: 2113.95 },
        { symbol: 'TSLA', name: 'Tesla Inc.', shares: 10, price: 248.42, change: 5.8, value: 2484.20 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 20, price: 378.91, change: 1.5, value: 7578.20 },
    ];

    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalGain = 2847.32;
    const gainPercent = (totalGain / totalValue) * 100;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 pb-32">
            {/* Header */}
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Investments</h1>
                    <p className="text-slate-500 mt-1">Track your portfolio performance</p>
                </div>
                <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold tracking-tight hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 active:scale-[0.98]">
                    <Plus size={18} />
                    Invest Now
                </button>
            </header>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-swiss p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-2xl shadow-blue-500/10">
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-2 opacity-80">Total Portfolio Value</p>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp size={16} className="text-emerald-400" />
                        <span className="text-emerald-400">+${totalGain.toFixed(2)} ({gainPercent.toFixed(2)}%)</span>
                    </div>
                </div>

                <div className="card-swiss p-8">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest opacity-60">Today's Change</p>
                    <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-2">+$342.18</h3>
                    <p className="text-sm text-slate-400 font-medium">+2.08% from yesterday</p>
                </div>

                <div className="card-swiss p-8">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest opacity-60">Total Holdings</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{holdings.length}</h3>
                    <p className="text-sm text-slate-400 font-medium">Across stocks & funds</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="card-swiss p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Portfolio Performance</h3>
                        <button className="text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
                    </div>
                    <PortfolioChart />
                </div>

                <div className="card-swiss p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Asset Allocation</h3>
                        <button className="text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
                    </div>
                    <SpendingPieChart />
                </div>
            </div>

            {/* Holdings Table */}
            <div className="card-swiss p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Your Holdings</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Symbol</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Shares</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Change</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding, idx) => (
                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{holding.symbol}</p>
                                            <p className="text-xs text-slate-500">{holding.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600">{holding.shares}</td>
                                    <td className="py-4 px-4 text-sm text-slate-600">${holding.price.toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <span className={`text-sm font-medium flex items-center gap-1 ${holding.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {holding.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {holding.change > 0 ? '+' : ''}{holding.change}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right font-semibold text-slate-900">${holding.value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
