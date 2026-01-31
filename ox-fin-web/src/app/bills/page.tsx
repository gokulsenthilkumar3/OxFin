'use client';

import { useState } from 'react';
import { Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { parseMockBills, type ParsedBill } from '@/lib/billParser';

export default function BillsPage() {
    const [parsedBills] = useState<ParsedBill[]>(parseMockBills());
    const [showParser, setShowParser] = useState(false);
    const upcomingBills = [
        { name: 'Netflix Subscription', amount: 15.99, dueDate: 'Jan 25', status: 'pending', category: 'Entertainment' },
        { name: 'Electric Bill', amount: 142.50, dueDate: 'Jan 28', status: 'pending', category: 'Utilities' },
        { name: 'Internet Service', amount: 79.99, dueDate: 'Feb 1', status: 'pending', category: 'Utilities' },
        { name: 'Car Insurance', amount: 245.00, dueDate: 'Feb 5', status: 'pending', category: 'Insurance' },
    ];

    const paidBills = [
        { name: 'Rent Payment', amount: 1850.00, paidDate: 'Jan 1', category: 'Housing' },
        { name: 'Phone Bill', amount: 65.00, paidDate: 'Jan 15', category: 'Utilities' },
        { name: 'Gym Membership', amount: 49.99, paidDate: 'Jan 10', category: 'Health' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bills & Payments</h1>
                <p className="text-slate-500 mt-1">Manage your recurring payments</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-swiss p-6 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock size={20} className="text-amber-500" />
                        <p className="text-sm font-medium text-slate-600">Upcoming Bills</p>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">${upcomingBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</h3>
                    <p className="text-xs text-slate-500 mt-1">{upcomingBills.length} bills due soon</p>
                </div>

                <div className="card-swiss p-6 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircle size={20} className="text-emerald-500" />
                        <p className="text-sm font-medium text-slate-600">Paid This Month</p>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">${paidBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</h3>
                    <p className="text-xs text-slate-500 mt-1">{paidBills.length} payments completed</p>
                </div>

                <div className="card-swiss p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar size={20} className="text-blue-500" />
                        <p className="text-sm font-medium text-slate-600">Auto-Pay Enabled</p>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">3</h3>
                    <p className="text-xs text-slate-500 mt-1">Bills on autopilot</p>
                </div>
            </div>

            {/* Auto-Parsed Bills from SMS/Email */}
            <div className="card-swiss p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-900">Auto-Synced Bills</h3>
                        <p className="text-sm text-slate-500">Automatically extracted from your messages</p>
                    </div>
                    <button
                        onClick={() => setShowParser(!showParser)}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        {showParser ? 'Hide' : 'Show'} Parser Info
                    </button>
                </div>
                <div className="space-y-4">
                    {parsedBills.map((bill, idx) => {
                        const SourceIcon = bill.source === 'sms' ? Smartphone : bill.source === 'email' ? Mail : MessageSquare;
                        return (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        <SourceIcon size={20} className="text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{bill.merchant}</p>
                                        <p className="text-sm text-slate-500">
                                            {bill.category} • Due {bill.dueDate}
                                            {bill.accountId && ` • ID: ${bill.accountId}`}
                                        </p>
                                        <span className="text-xs text-slate-400 capitalize">Source: {bill.source}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-lg font-bold text-slate-900">${bill.amount.toFixed(2)}</p>
                                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showParser && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <h4 className="font-semibold text-slate-900 mb-3">Auto-Bill Parser</h4>
                        <p className="text-sm text-slate-600 mb-3">
                            The auto-bill parser uses regex patterns to extract bill information from SMS/Email/WhatsApp messages.
                            It identifies amounts, due dates, merchant names, and account IDs automatically.
                        </p>
                        <div className="text-xs bg-white p-3 rounded border border-blue-200 text-slate-700 space-y-1">
                            <p><strong>Extracted Fields:</strong></p>
                            <p>• Amount: Detects Rs., ₹, or $ followed by numbers</p>
                            <p>• Due Date: Finds dates in DD/MM/YYYY or DD-MM-YYYY format</p>
                            <p>• Account ID: Extracts alphanumeric IDs (8+ characters)</p>
                            <p>• Category: Matches keywords like electricity, water, internet, etc.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upcoming Bills */}
            <div className="card-swiss p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Upcoming Bills</h3>
                <div className="space-y-4">
                    {upcomingBills.map((bill, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                    <DollarSign size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{bill.name}</p>
                                    <p className="text-sm text-slate-500">{bill.category} • Due {bill.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-bold text-slate-900">${bill.amount.toFixed(2)}</p>
                                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment History */}
            <div className="card-swiss p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Payment History</h3>
                <div className="space-y-3">
                    {paidBills.map((bill, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-emerald-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{bill.name}</p>
                                    <p className="text-xs text-slate-500">Paid on {bill.paidDate}</p>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">${bill.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
