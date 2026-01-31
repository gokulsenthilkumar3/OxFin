'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);

  const clearErrors = () => {
    setError('');
    setMfaRequired(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        mfaCode: mfaRequired ? mfaCode : undefined,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === 'MFA_REQUIRED') {
          setMfaRequired(true);
          setError('MFA Code Required');
        } else if (res.error === 'ACCOUNT_LOCKED') {
          setError('Account locked for 15 minutes due to too many failed attempts.');
        } else if (res.error === 'INVALID_MFA_CODE') {
          setError('Invalid 2FA code. Please try again.');
        } else {
          setError('Invalid email or password');
        }
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    if (password.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const loginRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setIsLogin(true);
        setError('Account created. Please login.');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during registration');
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side: 3D Abstract Visual / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCAzNmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSAzLjMxLTYgMy4zMS02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="relative z-10 max-w-lg text-white space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white font-extrabold text-4xl border border-white/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">O</span>
              </div>
              <span className="text-4xl font-extrabold tracking-tighter text-white">OxFin</span>
            </div>
            <h1 className="text-6xl font-extrabold mb-8 tracking-tighter leading-[1.1]">Financial intelligence<br /><span className="text-blue-400">reimagined.</span></h1>
            <p className="text-xl text-blue-100/80 leading-relaxed font-medium">
              Experience the future of wealth management. Zero friction, total clarity, and powerful insights designed for the modern investor.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            {['Swiss Grid System', 'Micro-Spring Physics', 'HSL Harmony'].map((item) => (
              <div key={item} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-white/10 transition-all cursor-default">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Abstract Visual Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px]"
        />
      </div>

      {/* Right Side: Login/Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Subtle noise pattern for the form side too */}
        <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Form Card */}
          <div className="card-swiss p-10 bg-white/95 border-slate-200/50">
            {/* Mobile Branding */}
            <div className="lg:hidden flex justify-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-blue-500/20">
                  O
                </div>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tighter">OxFin</span>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="bg-slate-100/80 p-1.5 rounded-2xl flex gap-1 mb-10 ring-1 ring-slate-200/50">
              <button
                onClick={() => { setIsLogin(true); clearErrors(); }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300",
                  isLogin ? "bg-white text-primary shadow-lg shadow-black/5" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Log In
              </button>
              <button
                onClick={() => { setIsLogin(false); clearErrors(); }}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300",
                  !isLogin ? "bg-white text-primary shadow-lg shadow-black/5" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="space-y-3 mb-10">
                  <h2 className="text-3xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    {isLogin ? 'Enter your details to access your secure portfolio.' : 'Join the elite tier of financial management today.'}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-bold leading-snug">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-8">
                  <div className="space-y-6">
                    {!isLogin && (
                      <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-slate-700/60 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50/50 focus:bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:opacity-40"
                        />
                      </div>
                    )}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-700/60 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50/50 focus:bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:opacity-40"
                      />
                    </div>
                    <div className="space-y-2.5 relative">
                      <div className="flex justify-between items-center mb-1 ml-1">
                        <label className="block text-xs font-bold text-slate-700/60 uppercase tracking-widest">Password</label>
                        {isLogin && (
                          <a href="#" className="text-[10px] text-primary uppercase font-bold tracking-widest hover:text-blue-700 transition-all">
                            Forgot?
                          </a>
                        )}
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={mfaRequired}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-slate-50/50 focus:bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:opacity-40 disabled:opacity-50"
                      />
                      {!isLogin && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">Min. 12 characters</p>}
                    </div>

                    {isLogin && mfaRequired && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-2"
                      >
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Shield size={14} /> Security Verification
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                          required
                          autoFocus
                          className="w-full text-center text-3xl font-extrabold tracking-[0.4em] py-5 rounded-2xl border-2 border-primary/20 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all bg-blue-50/30 text-primary"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      isLoading={loading}
                      size="lg"
                      className="w-full rounded-2xl py-7"
                    >
                      {isLogin ? (mfaRequired ? 'Verify & Sign In' : 'Sign In') : 'Create Account'}
                      <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </div>
                </form>

                <div className="relative mt-12 mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                    <span className="bg-white px-6 text-slate-400">Secure Access</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-3 px-4 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all text-xs font-bold text-slate-600 uppercase tracking-widest"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('github')}
                    className="flex items-center justify-center gap-3 px-4 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all text-xs font-bold text-slate-600 uppercase tracking-widest"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            Swiss-Engineered Financial Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
