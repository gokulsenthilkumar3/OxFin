'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

// Mock Data
const mockChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const mockSpendingData = [
    { name: 'Housing', value: 400 },
    { name: 'Food', value: 300 },
    { name: 'Transport', value: 300 },
    { name: 'Utilities', value: 200 },
];

const mockTrendData = [
    { name: 'Mon', income: 400, expense: 240 },
    { name: 'Tue', income: 300, expense: 139 },
    { name: 'Wed', income: 200, expense: 980 },
    { name: 'Thu', income: 278, expense: 390 },
    { name: 'Fri', income: 189, expense: 480 },
    { name: 'Sat', income: 239, expense: 380 },
    { name: 'Sun', income: 349, expense: 430 },
];

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#64748B']; // Trust Blue, Green, Amber, Slate

// Area Chart - Clean
export const PortfolioChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockChartData}>
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
            </defs>
            <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#1e293b' }}
            />
            <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
            />
        </AreaChart>
    </ResponsiveContainer>
);

// Pie Chart - Minimal Donut
export const SpendingPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={mockSpendingData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                cornerRadius={8}
                stroke="none" // Remove border
            >
                {mockSpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
        </PieChart>
    </ResponsiveContainer>
);

// Bar Chart - Rounded & Clean
export const TransactionTrendChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockTrendData} barSize={32}>
            <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="income" fill="#10B981" radius={[6, 6, 6, 6]} />
            <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 6, 6]} opacity={0.8} />
        </BarChart>
    </ResponsiveContainer>
);
