'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Bell, CreditCard, Shield, Mail, Phone, Globe, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConsentCenter from '@/components/ui/ConsentCenter';
import MFASetupModal from '@/components/ui/MFASetupModal';

const SettingsCard = ({ title, description, icon: Icon, children }: any) => (
    <div className="card-swiss p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
        {children}
    </div>
);

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            enabled ? "bg-primary" : "bg-slate-200"
        )}
    >
        <span
            className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                enabled ? "translate-x-6" : "translate-x-1"
            )}
        />
    </button>
);

export default function SettingsPage() {
    const { data: session } = useSession();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [isMFAModalOpen, setIsMFAModalOpen] = useState(false);
    const [biometricsEnabled, setBiometricsEnabled] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchSecurityStatus = async () => {
        try {
            const res = await fetch('/api/user/security-status');
            const data = await res.json();
            if (res.ok) {
                setTwoFactorEnabled(data.twoFactorEnabled);
            }
        } catch (err) {
            console.error('Failed to fetch security status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchSecurityStatus();
        }
    }, [session]);

    const handleMFAToggle = () => {
        if (!twoFactorEnabled) {
            setIsMFAModalOpen(true);
        } else {
            // Logic to disable MFA could be added here
            // For now, we only allow enabling via the modal
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and security</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingsCard
                    title="Profile & Account"
                    description="Update your personal information"
                    icon={User}
                >
                    <div className="space-y-6 pt-2">
                        <div>
                            <label className="text-sm font-bold text-slate-700/60 mb-2 block uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Agent Smith"
                                placeholder="Your full name"
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:opacity-30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700/60 mb-2 block uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                defaultValue="agent@oxfin.com"
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:opacity-30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700/60 mb-2 block uppercase tracking-wider">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue="+1 (555) 123-4567"
                                placeholder="+1 (000) 000-0000"
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:opacity-30"
                            />
                        </div>
                        <button className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold tracking-tight hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                            Save Changes
                        </button>
                    </div>
                </SettingsCard>

                {/* Security */}
                <SettingsCard
                    title="Security"
                    description="Manage authentication and security settings"
                    icon={Shield}
                >
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Lock size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                                    <p className="text-xs text-slate-500">Add an extra layer of security</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={twoFactorEnabled}
                                onChange={handleMFAToggle}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Biometric Login</p>
                                    <p className="text-xs text-slate-500">Use Face ID or Touch ID</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={biometricsEnabled} onChange={() => setBiometricsEnabled(!biometricsEnabled)} />
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <button className="text-sm text-primary font-medium hover:underline">Change Password</button>
                        </div>
                    </div>
                </SettingsCard>

                {/* Linked Bank Accounts */}
                <SettingsCard
                    title="Linked Bank Accounts"
                    description="Manage your connected financial institutions"
                    icon={CreditCard}
                >
                    <div className="space-y-4">
                        {[
                            { name: 'Chase Bank', account: '****1234', status: 'Connected' },
                            { name: 'Wells Fargo', account: '****5678', status: 'Connected' },
                        ].map((bank, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                        <CreditCard size={18} className="text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{bank.name}</p>
                                        <p className="text-xs text-slate-500">{bank.account}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                        <Check size={14} /> {bank.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-600 font-medium hover:border-primary hover:text-primary transition-colors">
                            + Add New Account
                        </button>
                    </div>
                </SettingsCard>

                {/* Notification Preferences */}
                <SettingsCard
                    title="Notification Preferences"
                    description="Control how you receive updates"
                    icon={Bell}
                >
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                                    <p className="text-xs text-slate-500">Transaction alerts and updates</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Push Notifications</p>
                                    <p className="text-xs text-slate-500">Real-time mobile alerts</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Marketing Communications</p>
                                    <p className="text-xs text-slate-500">Product updates and offers</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={false} onChange={() => { }} />
                        </div>
                    </div>
                </SettingsCard>
            </div>

            {/* Consent Center - Full Width */}
            <div>
                <ConsentCenter />
            </div>

            {/* MFA Setup Modal */}
            <MFASetupModal
                isOpen={isMFAModalOpen}
                onClose={() => setIsMFAModalOpen(false)}
                onSuccess={fetchSecurityStatus}
            />
        </div>
    );
}
