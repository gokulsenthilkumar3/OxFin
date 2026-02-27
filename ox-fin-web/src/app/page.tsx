'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, Lock, Mail, User, Shield, Hexagon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030712] overflow-hidden selection:bg-blue-500/30">
      {/* Animated Background Gradients map */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            transform: ['translate(0%, 0%) scale(1)', 'translate(5%, 10%) scale(1.1)', 'translate(-5%, -5%) scale(0.9)', 'translate(0%, 0%) scale(1)'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{
            transform: ['translate(0%, 0%) scale(1)', 'translate(-10%, -10%) scale(1.2)', 'translate(5%, 5%) scale(0.8)', 'translate(0%, 0%) scale(1)'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/20 blur-[130px] mix-blend-screen"
        />
        <motion.div
          animate={{
            transform: ['translate(0%, 0%) scale(1)', 'translate(10%, -5%) scale(1.1)', 'translate(-10%, 10%) scale(0.9)', 'translate(0%, 0%) scale(1)'],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-violet-900/15 blur-[150px] mix-blend-screen"
        />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwdi0yMHptLTIwIDBoMjB2MjBIMHYtMjB6IiBmaWxsPSIjMWUxZTFlIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 py-12 lg:py-20">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-2xl shadow-blue-500/30 mb-6 group">
            <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Hexagon className="w-10 h-10 text-white absolute" strokeWidth={1.5} />
            <span className="text-white font-bold text-2xl z-10">O</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="mb-2">
            <span style={{ fontWeight: 800 }}>OxFin</span>
            <span style={{ fontWeight: 400, opacity: 0.9 }}>Portal</span>
          </h1>
          <p className="mt-1 text-base text-slate-400 font-medium text-center">
            The next generation of computational finance.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 border border-slate-100 w-full mx-auto"
          style={{ padding: '3rem 2.5rem' }}
        >
          {/* Toggle Tabs */}
          <div className="relative flex p-1.5 mb-10 bg-slate-100 rounded-xl border border-slate-200/50 shadow-inner">
            <button
              onClick={() => { setIsLogin(true); clearErrors(); }}
              className={cn(
                "relative flex-1 py-3.5 text-base font-semibold rounded-lg transition-all duration-300",
                isLogin ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/40"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Log In</span>
            </button>
            <button
              onClick={() => { setIsLogin(false); clearErrors(); }}
              className={cn(
                "relative flex-1 py-3.5 text-base font-semibold rounded-lg transition-all duration-300",
                !isLogin ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {!isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/40"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>

          <motion.div layout className="relative">
            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-base font-medium shadow-sm"
                >
                  <Shield className="w-6 h-6 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col gap-4 relative z-10 w-full">
              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <div className="absolute left-[1.15rem] top-1/2 -translate-y-1/2 pointer-events-none">
                        <User className={cn("w-[26px] h-[26px] transition-colors duration-300", focusedInput === 'name' ? 'text-slate-800' : 'text-slate-400')} strokeWidth={2.5} />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                        required={!isLogin}
                        style={{ paddingLeft: '3.75rem' }}
                        className="w-full pr-4 py-5 rounded-2xl bg-[#f4f5f7] focus:bg-[#eceef1] focus:outline-none transition-all text-slate-900 placeholder:text-slate-500 font-semibold text-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout="position" className="relative">
                <div className="absolute left-[1.15rem] top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className={cn("w-[26px] h-[26px] transition-colors duration-300", focusedInput === 'email' ? 'text-slate-800' : 'text-slate-400')} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  style={{ paddingLeft: '3.75rem' }}
                  className="w-full pr-4 py-5 rounded-2xl bg-[#f4f5f7] focus:bg-[#eceef1] focus:outline-none transition-all text-slate-900 placeholder:text-slate-500 font-semibold text-lg"
                />
              </motion.div>

              <motion.div layout="position" className="relative">
                <div className="absolute left-[1.15rem] top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className={cn("w-[26px] h-[26px] transition-colors duration-300", focusedInput === 'password' ? 'text-slate-800' : 'text-slate-400')} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  disabled={mfaRequired}
                  style={{ paddingLeft: '3.75rem', paddingRight: '3.75rem' }}
                  className="w-full py-5 rounded-2xl bg-[#f4f5f7] focus:bg-[#eceef1] focus:outline-none transition-all text-slate-900 placeholder:text-slate-500 font-semibold text-lg disabled:opacity-50 disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[1.15rem] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[26px] h-[26px]" strokeWidth={2.5} /> : <Eye className="w-[26px] h-[26px]" strokeWidth={2.5} />}
                </button>
              </motion.div>

              <AnimatePresence initial={false}>
                {isLogin && (
                  <motion.div
                    key="forgot-pw"
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout="position"
                  >
                    <div className="flex justify-end pt-1">
                      <a href="#" className="text-[15px] text-slate-700 hover:text-slate-900 font-semibold transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {isLogin && mfaRequired && (
                  <motion.div
                    key="mfa"
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout="position"
                  >
                    <div className="flex flex-col gap-2 pt-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000 000"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        required
                        autoFocus
                        className="w-full text-center text-3xl tracking-[0.3em] py-5 rounded-2xl bg-[#f4f5f7] focus:bg-[#eceef1] focus:outline-none transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout="position" className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[22px] bg-[#111827] text-white font-bold text-[19px] py-[22px] transition-all duration-300 hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <motion.span
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        {isLogin ? (mfaRequired ? 'Verify & Enter' : 'Get Started') : 'Get Started'}
                      </motion.span>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium bg-slate-900/40 px-5 py-3 rounded-full backdrop-blur-md mx-auto w-fit border border-white/5 shadow-lg"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Secured by enterprise-grade encryption</span>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
