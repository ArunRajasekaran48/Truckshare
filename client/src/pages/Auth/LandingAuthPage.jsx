import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { UIContext } from '@/context/UIContext';

export function LandingAuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuth();
  const { toast } = useContext(UIContext);
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('BUSINESS_USER');

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: 'BUSINESS_USER' },
  });

  const activeTabClass = useMemo(
    () => 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105',
    []
  );

  const inactiveTabClass = useMemo(
    () => 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 scale-95',
    []
  );

  const switchMode = (nextMode) => {
    setMode(nextMode);
    navigate(nextMode === 'login' ? '/login' : '/register', { replace: true });
  };

  const onLogin = async ({ userId, password }) => {
    try {
      const data = await login(userId, password);
      toast.success('Welcome back!');
      const home =
        data.role === 'TRUCK_OWNER'
          ? '/dashboard/owner'
          : data.role === 'DRIVER'
            ? '/dashboard/driver'
            : '/dashboard/business';
      navigate(home);
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    }
  };

  const onRegister = async (data) => {
    try {
      await registerUser({ ...data, role });
      toast.success('Account created! Please sign in.');
      switchMode('login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 md:grid-cols-2">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[50vh] overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-6 text-white sm:p-8 lg:p-12 md:min-h-screen flex flex-col justify-between">
        {/* Animated Background Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Top Section */}
          <div>
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Logistics Revolution
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
                Move Freight
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Smarter & Faster
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed font-medium">
              Connect truck owners, businesses, and drivers on one powerful platform. Real-time matching, instant payments, and complete visibility—all in one place.
            </p>
          </div>

          {/* Hero Illustration Card */}
          <div className="mt-12 rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-md hover:border-white/40 transition-all duration-300">
            <div className="space-y-6">
              {/* Truck Illustration */}
              <svg viewBox="0 0 640 320" className="h-auto w-full filter drop-shadow-lg" role="img" aria-label="Smart logistics illustration">
                <defs>
                  <linearGradient id="truckGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                  <linearGradient id="roadGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Road */}
                <path d="M 0 200 Q 160 150, 320 180 T 640 200" stroke="url(#roadGradient)" strokeWidth="60" fill="none" strokeLinecap="round" opacity="0.6" />
                <circle cx="80" cy="200" r="8" fill="#FCD34D" />
                <circle cx="620" cy="200" r="8" fill="#86EFAC" />

                {/* Truck Body */}
                <g filter="url(#glow)">
                  <rect x="200" y="120" width="160" height="100" rx="12" fill="url(#truckGradient)" />
                  {/* Cabin */}
                  <rect x="360" y="140" width="50" height="60" rx="8" fill="#0369A1" />
                  <circle cx="375" cy="165" r="4" fill="#FCD34D" />
                  
                  {/* Windows */}
                  <rect x="210" y="135" width="35" height="25" rx="4" fill="#E0F2FE" opacity="0.7" />
                  <rect x="255" y="135" width="35" height="25" rx="4" fill="#E0F2FE" opacity="0.7" />
                  <rect x="300" y="135" width="35" height="25" rx="4" fill="#E0F2FE" opacity="0.7" />

                  {/* Wheels */}
                  <circle cx="240" cy="225" r="15" fill="#0F172A" />
                  <circle cx="240" cy="225" r="10" fill="#38BDF8" />
                  <circle cx="330" cy="225" r="15" fill="#0F172A" />
                  <circle cx="330" cy="225" r="10" fill="#38BDF8" />
                  <circle cx="390" cy="225" r="15" fill="#0F172A" />
                  <circle cx="390" cy="225" r="10" fill="#38BDF8" />
                </g>

                {/* Status Indicators */}
                <g className="animate-pulse">
                  <circle cx="260" cy="100" r="4" fill="#FCD34D" />
                  <text x="280" y="105" fontSize="12" fill="#E0F2FE" fontWeight="bold">Real-time Tracking</text>
                  
                  <circle cx="360" cy="90" r="4" fill="#86EFAC" />
                  <text x="375" y="95" fontSize="12" fill="#E0F2FE" fontWeight="bold">Smart Matching</text>
                </g>
              </svg>

              {/* Feature Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="rounded-lg bg-cyan-500/20 border border-cyan-400/40 p-3 text-center hover:bg-cyan-500/30 transition-all">
                  <p className="text-xs font-bold text-cyan-100">Live Tracking</p>
                </div>
                <div className="rounded-lg bg-blue-500/20 border border-blue-400/40 p-3 text-center hover:bg-blue-500/30 transition-all">
                  <p className="text-xs font-bold text-blue-100">Instant Match</p>
                </div>
                <div className="rounded-lg bg-purple-500/20 border border-purple-400/40 p-3 text-center hover:bg-purple-500/30 transition-all">
                  <p className="text-xs font-bold text-purple-100">Quick Pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUTH SECTION ===== */}
      <section className="flex items-center bg-white/50 p-4 backdrop-blur-sm sm:p-6 lg:p-10">
        <div className="mx-auto w-full max-w-xl p-2 sm:p-6">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
              <span className="text-4xl">🚛</span>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              TruckShare
            </h2>
            <p className="text-sm text-slate-600 font-semibold">Logistics Platform</p>
          </div>

          {/* Mode Tabs */}
          <div className="mb-8 rounded-xl bg-slate-100 p-1.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-lg px-4 py-3 text-sm font-bold transition-all transform duration-200 ${
                  mode === 'login' ? activeTabClass : inactiveTabClass
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-lg px-4 py-3 text-sm font-bold transition-all transform duration-200 ${
                  mode === 'register' ? activeTabClass : inactiveTabClass
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
              <div>
                <label className="label">User ID</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">👤</div>
                  <input
                    {...loginRegister('userId')}
                    className="input-field pl-12 border-blue-300 focus:border-blue-500"
                    placeholder="your_user_id"
                    autoComplete="username"
                  />
                </div>
                {loginErrors.userId && <p className="error-text">{loginErrors.userId.message}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">🔐</div>
                  <input
                    {...loginRegister('password')}
                    type="password"
                    className="input-field pl-12 border-blue-300 focus:border-blue-500"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                {loginErrors.password && <p className="error-text">{loginErrors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all">
                {isLoading ? '⏳ Signing in...' : '🚀 Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
              {/* Role Selector */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="text-lg">🎯</span> Select Your Role
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { value: 'TRUCK_OWNER', icon: '🚚', label: 'Truck Owner', color: 'blue' },
                    { value: 'BUSINESS_USER', icon: '📦', label: 'Business', color: 'purple' },
                    { value: 'DRIVER', icon: '👨‍💼', label: 'Driver', color: 'green' },
                  ].map(({ value, icon, label, color }) => {
                    const colors = {
                      blue: 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
                      purple: 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700',
                      green: 'border-green-400 bg-gradient-to-br from-green-50 to-green-100 text-green-700',
                    };
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`rounded-xl border-2 px-3 py-3 text-xs font-bold transition-all transform hover:scale-105 ${
                          role === value
                            ? `${colors[color]} shadow-lg ring-2 ring-offset-2 ring-${color}-400`
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-2xl mb-1.5">{icon}</p>
                        <p>{label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User ID & Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">User ID</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">👤</div>
                    <input
                      {...registerField('userId')}
                      className="input-field pl-12 border-blue-300"
                      placeholder="unique_username"
                    />
                  </div>
                  {registerErrors.userId && <p className="error-text">{registerErrors.userId.message}</p>}
                </div>
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">📧</div>
                    <input
                      {...registerField('email')}
                      type="email"
                      className="input-field pl-12 border-blue-300"
                      placeholder="you@example.com"
                    />
                  </div>
                  {registerErrors.email && <p className="error-text">{registerErrors.email.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">📱</div>
                  <input
                    {...registerField('phone')}
                    type="tel"
                    className="input-field pl-12 border-blue-300"
                    placeholder="+91-9876543210"
                  />
                </div>
                {registerErrors.phone && <p className="error-text">{registerErrors.phone.message}</p>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">🔐</div>
                    <input
                      {...registerField('password')}
                      type="password"
                      className="input-field pl-12 border-blue-300"
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.password && <p className="error-text">{registerErrors.password.message}</p>}
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600 font-bold text-lg">✓</div>
                    <input
                      {...registerField('confirmPassword')}
                      type="password"
                      className="input-field pl-12 border-blue-300"
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.confirmPassword && <p className="error-text">{registerErrors.confirmPassword.message}</p>}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary mt-4 w-full py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all">
                {isLoading ? '⏳ Creating account...' : '🚀 Create Account'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs text-slate-600">
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
