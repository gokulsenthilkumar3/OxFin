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

const COLORS = ['#818CF8', '#34D399', '#FBBF24', '#94A3B8']; // Adjusted for dark theme

// Tooltip style common
const tooltipStyle = {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    color: '#fff',
    backdropFilter: 'blur(10px)'
};

// Area Chart - Clean
export const PortfolioChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockChartData}>
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                </linearGradient>
            </defs>
            <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#fff' }}
            />
            <Area
                type="monotone"
                dataKey="value"
                stroke="#818CF8"
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
                stroke="rgba(0,0,0,0)" // Remove border
            >
                {mockSpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#fff' }}
            />
        </PieChart>
    </ResponsiveContainer>
);

// Bar Chart - Rounded & Clean
export const TransactionTrendChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockTrendData} barSize={32}>
            <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="income" fill="#34D399" radius={[6, 6, 6, 6]} />
            <Bar dataKey="expense" fill="#F87171" radius={[6, 6, 6, 6]} opacity={0.8} />
        </BarChart>
    </ResponsiveContainer>
);
