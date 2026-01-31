// Mock data for OxFin

import { WalletBalance, Transaction, Investment, Bill, OxCryptoData } from '@/types';

export const mockWallets: WalletBalance[] = [
    {
        type: 'full',
        balance: 125000,
        currency: 'INR',
        interestRate: 4.875, // 75% of 6.5% repo rate
    },
    {
        type: 'lite',
        balance: 5420,
        currency: 'INR',
        dailyLimit: 10000, // ~1g gold value
    },
];

export const mockOxCrypto: OxCryptoData = {
    currentRate: 1.0, // 1 Ox = 1 CHF
    buyRate: 1.01, // 101 CHF for 100 Ox (1% fee)
    balance: 250, // Ox tokens
    totalInvested: 25250, // CHF invested
};

export const mockTransactions: Transaction[] = [
    {
        id: '1',
        type: 'credit',
        amount: 5000,
        currency: 'INR',
        description: 'Salary Credit - Acme Corp',
        category: 'income',
        timestamp: new Date('2026-01-15T10:30:00'),
        status: 'completed',
    },
    {
        id: '2',
        type: 'debit',
        amount: 1250,
        currency: 'INR',
        description: 'Netflix Subscription',
        category: 'entertainment',
        timestamp: new Date('2026-01-14T18:45:00'),
        status: 'completed',
    },
    {
        id: '3',
        type: 'debit',
        amount: 3500,
        currency: 'INR',
        description: 'Grocery Shopping - BigBasket',
        category: 'shopping',
        timestamp: new Date('2026-01-13T16:20:00'),
        status: 'completed',
    },
    {
        id: '4',
        type: 'credit',
        amount: 75,
        currency: 'INR',
        description: 'Cashback - Palm Card',
        category: 'cashback',
        timestamp: new Date('2026-01-12T12:00:00'),
        status: 'completed',
    },
    {
        id: '5',
        type: 'debit',
        amount: 850,
        currency: 'INR',
        description: 'Electricity Bill',
        category: 'utilities',
        timestamp: new Date('2026-01-11T09:15:00'),
        status: 'completed',
    },
];

export const mockInvestments: Investment[] = [
    {
        id: '1',
        name: 'HDFC Bank Ltd.',
        type: 'stocks',
        currentValue: 45600,
        investedAmount: 40000,
        returnPercent: 14.0,
        units: 30,
    },
    {
        id: '2',
        name: 'HDFC Mid-Cap Opportunities Fund',
        type: 'mf',
        currentValue: 28900,
        investedAmount: 25000,
        returnPercent: 15.6,
    },
    {
        id: '3',
        name: 'Fixed Deposit - SBI',
        type: 'fd',
        currentValue: 52150,
        investedAmount: 50000,
        returnPercent: 7.2,
    },
    {
        id: '4',
        name: 'Nifty 50 ETF',
        type: 'etf',
        currentValue: 21400,
        investedAmount: 20000,
        returnPercent: 7.0,
    },
];

export const mockBills: Bill[] = [
    {
        id: '1',
        billerName: 'BESCOM Electricity',
        amount: 1850,
        dueDate: new Date('2026-01-25'),
        category: 'electricity',
        status: 'pending',
        autoPayEnabled: true,
    },
    {
        id: '2',
        billerName: 'Airtel Postpaid',
        amount: 699,
        dueDate: new Date('2026-01-20'),
        category: 'telecom',
        status: 'pending',
        autoPayEnabled: true,
    },
    {
        id: '3',
        billerName: 'Bangalore Water Supply',
        amount: 420,
        dueDate: new Date('2026-01-22'),
        category: 'water',
        status: 'pending',
        autoPayEnabled: false,
    },
];

// AI Recommendation Mock
export interface AIRecommendation {
    id: string;
    title: string;
    description: string;
    category: 'investment' | 'insurance' | 'savings' | 'loan';
    confidence: number;
    action?: string;
}

export const mockAIRecommendations: AIRecommendation[] = [
    {
        id: '1',
        title: 'Optimize Your Portfolio',
        description: 'Based on your risk profile, consider allocating 15% to international equity funds for diversification.',
        category: 'investment',
        confidence: 87,
    },
    {
        id: '2',
        title: 'Travel Insurance Alert',
        description: 'We noticed flight bookings in your email. Get comprehensive travel insurance for ₹499 covering 50L.',
        category: 'insurance',
        confidence: 95,
    },
    {
        id: '3',
        title: 'Save More with Ox Wallet',
        description: 'Transfer ₹25,000 to Ox Wallet to earn 4.875% interest (₹3.33/day) vs 0% in your bank account.',
        category: 'savings',
        confidence: 92,
    },
];
