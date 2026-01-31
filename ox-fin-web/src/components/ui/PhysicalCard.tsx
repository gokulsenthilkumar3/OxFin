'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type PhysicalCardProps = {
    balance: number;
    currency?: string;
    cardNumber?: string;
    cardHolder?: string;
    expiry?: string;
    variant?: 'primary' | 'dark' | 'glass';
    className?: string;
};

export default function PhysicalCard({
    balance,
    currency = '$',
    cardNumber = '•••• •••• •••• 1234',
    cardHolder = 'John Doe',
    expiry = '12/28',
    variant = 'primary',
    className
}: PhysicalCardProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
                "card-physical w-full aspect-[1.586] p-8 flex flex-col justify-between select-none shadow-2xl hover:shadow-blue-500/10 transition-all duration-500",
                variant === 'primary' && "bg-gradient-to-br from-blue-600 to-indigo-700",
                variant === 'dark' && "bg-slate-900",
                variant === 'glass' && "bg-white/10 backdrop-blur-md border border-white/20 text-foreground", // Adjust text for glass lighter bg if needed
                className
            )}
        >
            {/* Magnetic Strip / Chip Mockup visually */}
            <div className="flex justify-between items-start">
                <div className="w-12 h-8 rounded bg-yellow-400/20 border border-yellow-400/40 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30" />
                </div>
                <div className="text-xl font-bold tracking-widest italic opacity-80">Ox</div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-medium opacity-70 mb-1 uppercase tracking-wider">Current Balance</p>
                    <h3 className="text-3xl font-bold tracking-tight">
                        {currency}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase opacity-60 tracking-widest">Card Holder</p>
                        <p className="font-medium tracking-wide text-sm">{cardHolder}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase opacity-60 tracking-widest">Expires</p>
                        <p className="font-medium tracking-wide text-sm">{expiry}</p>
                    </div>
                </div>
            </div>

            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </motion.div>
    );
}
