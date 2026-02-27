'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Bell, CreditCard, Shield, Mail, Globe, Check, Loader2, Save, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConsentCenter from '@/components/ui/ConsentCenter';
import MFASetupModal from '@/components/ui/MFASetupModal';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
            enabled ? 'bg-blue-600' : 'bg-slate-700'
        )}
    >
        <span className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
            enabled ? 'translate-x-6' : 'translate-x-1'
        )} />
    </button>
);

const SectionCard = ({ title, description, icon: Icon, children }: any) => (
    <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-blue-400" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const SettingRow = ({ icon: Icon, label, description, control }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-3">
            <Icon size={16} className="text-slate-500 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
        </div>
        {control}
    </div>
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
            if (res.ok) setTwoFactorEnabled(data.twoFactorEnabled);
        } catch (err) {
            console.error('Failed to fetch security status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (session) fetchSecurityStatus(); }, [session]);

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <header className="pt-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-1">Account</p>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Settings</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your account preferences and security</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <SectionCard title="Profile & Account" description="Update your personal information" icon={User}>
                    <div className="space-y-4">
                        {[
                            { label: 'Full Name', type: 'text', defaultValue: session?.user?.name || 'Agent Smith', placeholder: 'Your full name' },
                            { label: 'Email Address', type: 'email', defaultValue: session?.user?.email || 'agent@oxfin.com', placeholder: 'name@example.com' },
                            { label: 'Phone Number', type: 'tel', defaultValue: '+1 (555) 123-4567', placeholder: '+1 (000) 000-0000' },
                        ].map((field) => (
                            <div key={field.label}>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{field.label}</label>
                                <input
                                    type={field.type}
                                    defaultValue={field.defaultValue}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/5 text-slate-200 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/8 transition-all"
                                />
                            </div>
                        ))}
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                            <Save size={15} /> Save Changes
                        </button>
                    </div>
                </SectionCard>

                {/* Security */}
                <SectionCard title="Security" description="Manage authentication and access controls" icon={Shield}>
                    <div>
                        <SettingRow
                            icon={Lock}
                            label="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                            control={
                                loading
                                    ? <Loader2 size={16} className="text-blue-400 animate-spin" />
                                    : <ToggleSwitch enabled={twoFactorEnabled} onChange={() => !twoFactorEnabled && setIsMFAModalOpen(true)} />
                            }
                        />
                        <SettingRow
                            icon={Shield}
                            label="Biometric Login"
                            description="Use Face ID or fingerprint to authenticate"
                            control={<ToggleSwitch enabled={biometricsEnabled} onChange={() => setBiometricsEnabled(!biometricsEnabled)} />}
                        />
                        <div className="pt-4">
                            <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">
                                Change Password →
                            </button>
                        </div>
                    </div>
                </SectionCard>

                {/* Linked Accounts */}
                <SectionCard title="Linked Bank Accounts" description="Manage your connected financial institutions" icon={CreditCard}>
                    <div className="space-y-3">
                        {[
                            { name: 'Chase Bank', account: '****1234' },
                            { name: 'Wells Fargo', account: '****5678' },
                        ].map((bank, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/6 hover:bg-white/6 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/8 flex items-center justify-center">
                                        <CreditCard size={15} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{bank.name}</p>
                                        <p className="text-xs text-slate-500">{bank.account}</p>
                                    </div>
                                </div>
                                <span className="badge badge-success flex items-center gap-1">
                                    <Check size={10} /> Connected
                                </span>
                            </div>
                        ))}
                        <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20 text-sm font-medium transition-all flex items-center justify-center gap-2">
                            <Plus size={15} /> Add New Account
                        </button>
                    </div>
                </SectionCard>

                {/* Notifications */}
                <SectionCard title="Notification Preferences" description="Control how you receive updates" icon={Bell}>
                    <div>
                        <SettingRow
                            icon={Mail}
                            label="Email Notifications"
                            description="Transaction alerts and account activity"
                            control={<ToggleSwitch enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />}
                        />
                        <SettingRow
                            icon={Bell}
                            label="Push Notifications"
                            description="Real-time mobile and browser alerts"
                            control={<ToggleSwitch enabled={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />}
                        />
                        <SettingRow
                            icon={Globe}
                            label="Marketing Communications"
                            description="Product updates and promotional offers"
                            control={<ToggleSwitch enabled={false} onChange={() => { }} />}
                        />
                    </div>
                </SectionCard>
            </div>

            {/* Consent Center */}
            <ConsentCenter />

            <MFASetupModal
                isOpen={isMFAModalOpen}
                onClose={() => setIsMFAModalOpen(false)}
                onSuccess={fetchSecurityStatus}
            />
        </div>
    );
}
