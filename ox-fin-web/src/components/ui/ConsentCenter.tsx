'use client';

import { useState } from 'react';
import { Shield, Mail, MessageSquare, Smartphone, CheckCircle, XCircle, Info } from 'lucide-react';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-200'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

export default function ConsentCenter() {
    const [permissions, setPermissions] = useState({
        sms: false,
        email: false,
        whatsapp: false,
    });

    const togglePermission = (key: 'sms' | 'email' | 'whatsapp') => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const permissionItems = [
        {
            key: 'sms' as const,
            icon: Smartphone,
            title: 'SMS Reading',
            description: 'Parse transaction alerts and bill notifications from your SMS inbox',
            benefits: ['Auto-sync bills', 'Transaction alerts', 'OTP verification'],
            dataUsage: 'We only read messages from banks and utility providers. No personal messages are accessed.',
        },
        {
            key: 'email' as const,
            icon: Mail,
            title: 'Email Access',
            description: 'Read e-statements and bills from financial institutions',
            benefits: ['E-statement parsing', 'Bill reminders', 'Investment updates'],
            dataUsage: 'We scan emails from known financial senders only. Your personal emails remain private.',
        },
        {
            key: 'whatsapp' as const,
            icon: MessageSquare,
            title: 'WhatsApp Alerts',
            description: 'Receive bill notifications and payment confirmations via WhatsApp',
            benefits: ['Real-time alerts', 'Payment confirmations', 'Bill due reminders'],
            dataUsage: 'We send notifications only. We do not read your WhatsApp messages.',
        },
    ];

    const enabledCount = Object.values(permissions).filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card-swiss p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">Consent & Privacy Center</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Control how OxFin accesses your data to provide automated bill tracking and financial insights.
                            All data is encrypted and never shared with third parties.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            {enabledCount > 0 ? (
                                <CheckCircle size={16} className="text-emerald-600" />
                            ) : (
                                <XCircle size={16} className="text-slate-400" />
                            )}
                            <span className="font-medium text-slate-700">
                                {enabledCount} of {permissionItems.length} permissions enabled
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permission Cards */}
            <div className="space-y-4">
                {permissionItems.map((item) => {
                    const Icon = item.icon;
                    const isEnabled = permissions[item.key];

                    return (
                        <div key={item.key} className="card-swiss p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-primary/10' : 'bg-slate-100'
                                        }`}>
                                        <Icon size={20} className={isEnabled ? 'text-primary' : 'text-slate-400'} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-600 mb-3">{item.description}</p>

                                        {/* Benefits */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {item.benefits.map((benefit, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Data Usage Info */}
                                        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-slate-600">{item.dataUsage}</p>
                                        </div>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={isEnabled}
                                    onChange={() => togglePermission(item.key)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Privacy Policy Link */}
            <div className="card-swiss p-4 bg-slate-50">
                <p className="text-sm text-slate-600 text-center">
                    By enabling these permissions, you agree to our{' '}
                    <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary font-medium hover:underline">Terms of Service</a>.
                    You can revoke access anytime.
                </p>
            </div>
        </div>
    );
}
