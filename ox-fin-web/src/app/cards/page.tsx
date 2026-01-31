'use client';

import { useState } from 'react';
import { Lock, Unlock, Eye, MoreVertical, Plus } from 'lucide-react';
import PhysicalCard from '@/components/ui/PhysicalCard';

export default function CardsPage() {
    const [cardLocked, setCardLocked] = useState(false);

    const cards = [
        { id: 1, name: 'OxFine Platinum', balance: 28450.00, last4: '1234', expiry: '09/29', type: 'primary' },
        { id: 2, name: 'OxFine Business', balance: 15230.50, last4: '5678', expiry: '12/28', type: 'dark' },
    ];

    const transactions = [
        { merchant: 'Amazon', amount: -129.99, date: 'Today, 2:30 PM', category: 'Shopping' },
        { merchant: 'Starbucks', amount: -5.75, date: 'Today, 9:15 AM', category: 'Food' },
        { merchant: 'Uber', amount: -18.50, date: 'Yesterday, 6:45 PM', category: 'Transport' },
        { merchant: 'Netflix', amount: -15.99, date: 'Jan 15', category: 'Entertainment' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cards</h1>
                    <p className="text-slate-500 mt-1">Manage your virtual and physical cards</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2">
                    <Plus size={18} />
                    Request Card
                </button>
            </header>

            {/* Cards Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <div key={card.id}>
                        <PhysicalCard
                            balance={card.balance}
                            cardHolder="AGENT SMITH"
                            expiry={card.expiry}
                            variant={card.type as any}
                        />
                    </div>
                ))}
            </div>

            {/* Card Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setCardLocked(!cardLocked)}
                    className="card-swiss p-6 hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        {cardLocked ? (
                            <Lock size={24} className="text-red-500" />
                        ) : (
                            <Unlock size={24} className="text-emerald-500" />
                        )}
                        <div className="text-left">
                            <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                                {cardLocked ? 'Card Locked' : 'Card Active'}
                            </p>
                            <p className="text-sm text-slate-500">Tap to {cardLocked ? 'unlock' : 'lock'}</p>
                        </div>
                    </div>
                </button>

                <button className="card-swiss p-6 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <Eye size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                            <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">View PIN</p>
                            <p className="text-sm text-slate-500">Reveal your PIN</p>
                        </div>
                    </div>
                </button>

                <button className="card-swiss p-6 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <MoreVertical size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                            <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Set Limits</p>
                            <p className="text-sm text-slate-500">Spending controls</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Recent Transactions */}
            <div className="card-swiss p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Recent Card Transactions</h3>
                <div className="space-y-4">
                    {transactions.map((txn, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                                    {txn.merchant[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{txn.merchant}</p>
                                    <p className="text-xs text-slate-400">{txn.date} • {txn.category}</p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">${Math.abs(txn.amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
