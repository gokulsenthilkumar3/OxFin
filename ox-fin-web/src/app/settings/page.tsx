'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Bell, CreditCard, Shield, Mail, Phone, Globe, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConsentCenter from '@/components/ui/ConsentCenter';
import MFASetupModal from '@/components/ui/MFASetupModal';

const SettingsCard = ({ title, description, icon: Icon, children }: any) => (
    <div className="card-swiss p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-sm text-white/50">{description}</p>
            </div>
        </div>
        {children}
    </div>
);

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        title="Toggle Setting"
        aria-label="Toggle Setting"
        className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 border border-white/10",
            enabled ? "bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "bg-black/50"
        )}
    >
        <span
            className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-sm",
                enabled ? "translate-x-6" : "translate-x-1 opacity-50"
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
            // Logic to disable MFA
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32 relative z-10" suppressHydrationWarning>
            {/* Background Ambient Orbs for Settings */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-orb pointer-events-none -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[150px] animate-orb-delayed pointer-events-none -z-10" />

            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Settings</h1>
                <p className="text-white/60 mt-2 font-medium">Manage your account preferences and security</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile & Account */}
                <SettingsCard
                    title="Profile & Account"
                    description="Update your personal information"
                    icon={User}
                >
                    <div className="space-y-6 pt-2">
                        <div>
                            <label className="text-[10px] font-bold text-white/40 mb-2 block uppercase tracking-[0.2em]">Full Name</label>
                            <input
                                type="text"
                                defaultValue={session?.user?.name || "Agent Smith"}
                                placeholder="Your full name"
                                className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-white/20 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/40 mb-2 block uppercase tracking-[0.2em]">Email Address</label>
                            <input
                                type="email"
                                defaultValue={session?.user?.email || "agent@oxfin.com"}
                                placeholder="name@example.com"
                                className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-white/20 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/40 mb-2 block uppercase tracking-[0.2em]">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue="+1 (555) 123-4567"
                                placeholder="+1 (000) 000-0000"
                                className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-white/20 transition-all text-sm"
                            />
                        </div>
                        <button className="glass-button w-full py-3.5 rounded-xl font-bold tracking-wide mt-4">
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
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><Lock size={20} className="text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                                    <p className="text-xs text-white/50 mt-1">Add an extra layer of security</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={twoFactorEnabled}
                                onChange={handleMFAToggle}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><Shield size={20} className="text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Biometric Login</p>
                                    <p className="text-xs text-white/50 mt-1">Use Face ID or Touch ID</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={biometricsEnabled} onChange={() => setBiometricsEnabled(!biometricsEnabled)} />
                        </div>
                        <div className="pt-2">
                            <button className="text-sm text-white/70 font-semibold hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white">
                                Change Password
                            </button>
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
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                                        <CreditCard size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white tracking-wide">{bank.name}</p>
                                        <p className="text-[10px] text-white/50 tracking-widest mt-0.5">{bank.account}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                        <Check size={12} strokeWidth={3} /> {bank.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3.5 rounded-xl border-2 border-dashed border-white/20 text-white/60 font-bold tracking-wide hover:border-white/50 hover:text-white hover:bg-white/5 transition-all mt-2">
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><Mail size={20} className="text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Email Notifications</p>
                                    <p className="text-xs text-white/50 mt-1">Transaction alerts and updates</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><Bell size={20} className="text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Push Notifications</p>
                                    <p className="text-xs text-white/50 mt-1">Real-time mobile alerts</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><Globe size={20} className="text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Marketing</p>
                                    <p className="text-xs text-white/50 mt-1">Product updates and offers</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={false} onChange={() => { }} />
                        </div>
                    </div>
                </SettingsCard>
            </div>

            {/* Consent Center - Full Width */}
            <div className="mt-8">
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
