'use client';

import { TrendingUp, BookOpen, Shield, Plane, Heart, GraduationCap, ArrowRight } from 'lucide-react';

interface Recommendation {
    id: string;
    title: string;
    description: string;
    category: 'insurance' | 'investment' | 'education' | 'savings';
    icon: any;
    action: string;
    relevance: string;
}

export default function AIRecommendations() {
    // Mock recommendations based on spending patterns
    const recommendations: Recommendation[] = [
        {
            id: '1',
            title: 'Travel Insurance',
            description: 'You spent $1,240 on travel last month. Protect your trips with comprehensive coverage starting at $12/month.',
            category: 'insurance',
            icon: Plane,
            action: 'Get Quote',
            relevance: 'Based on your travel spending',
        },
        {
            id: '2',
            title: 'High-Yield Savings',
            description: 'Your balance is $28,450. Consider moving funds to a high-yield account earning 4.5% APY.',
            category: 'savings',
            icon: TrendingUp,
            action: 'Learn More',
            relevance: 'High balance detected',
        },
        {
            id: '3',
            title: 'Index Funds',
            description: 'Diversify your portfolio with low-cost index funds. Start investing with as little as $100.',
            category: 'investment',
            icon: TrendingUp,
            action: 'Explore Funds',
            relevance: 'Investment opportunity',
        },
        {
            id: '4',
            title: 'Financial Literacy Course',
            description: 'Learn advanced investment strategies and tax optimization. Free course from OxFin Varsity.',
            category: 'education',
            icon: GraduationCap,
            action: 'Start Learning',
            relevance: 'Recommended for you',
        },
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'insurance': return 'from-blue-500 to-indigo-600';
            case 'investment': return 'from-emerald-500 to-teal-600';
            case 'education': return 'from-purple-500 to-pink-600';
            case 'savings': return 'from-amber-500 to-orange-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">For You</h3>
                    <p className="text-sm text-slate-500 mt-1">Personalized recommendations based on your financial activity</p>
                </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec) => {
                    const Icon = rec.icon;
                    return (
                        <div key={rec.id} className="card-swiss p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(rec.category)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                                            {rec.title}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 italic">{rec.relevance}</span>
                                        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                                            {rec.action}
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Financial Literacy Section */}
            <div className="card-swiss p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={24} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">OxFin Varsity</h4>
                        <p className="text-sm text-slate-600 mb-4">
                            Access free financial education courses covering budgeting, investing, tax planning, and more.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Budgeting 101', 'Stock Market Basics', 'Tax Optimization', 'Retirement Planning'].map((course) => (
                                <span key={course} className="text-xs px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 font-medium">
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
