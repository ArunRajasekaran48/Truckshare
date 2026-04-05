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
    () => 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg',
    []
  );

  const inactiveTabClass = useMemo(
    () => 'text-cyan-50 hover:text-white hover:bg-white/15',
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
    <div className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 md:grid-cols-2">
      <section className="relative min-h-[44vh] overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-600 p-6 text-white sm:p-8 lg:p-10 md:min-h-screen">
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-white/15 blur-3xl" aria-hidden />
          <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl" aria-hidden />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">TruckShare Platform</p>
              <h1 className="mt-3 !bg-none !text-white text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Share extra truck space and deliver smarter
              </h1>
              <p className="mt-4 max-w-xl text-sm text-cyan-100 sm:text-base">
                Truck owners can fill empty capacity, businesses can ship small loads without paying for a full truck, and drivers get a live trip workspace.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5">
              <svg viewBox="0 0 620 260" className="h-auto w-full" role="img" aria-label="Route and truck illustration">
                <defs>
                  <linearGradient id="heroRoad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9ADFFF" />
                    <stop offset="100%" stopColor="#D8F6FF" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="620" height="260" rx="20" fill="rgba(255,255,255,0.08)" />
                <path d="M30 185 C150 125, 260 220, 390 160 C470 122, 535 165, 590 120" stroke="url(#heroRoad)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="2 18" />
                <circle cx="35" cy="184" r="10" fill="#FDE68A" />
                <circle cx="590" cy="120" r="10" fill="#86EFAC" />
                <rect x="245" y="130" width="88" height="38" rx="10" fill="#FFFFFF" />
                <rect x="322" y="140" width="30" height="28" rx="7" fill="#E0F2FE" />
                <circle cx="270" cy="173" r="9" fill="#0F172A" />
                <circle cx="335" cy="173" r="9" fill="#0F172A" />
                <rect x="255" y="138" width="22" height="10" rx="4" fill="#38BDF8" />
              </svg>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-cyan-100">
                <span className="rounded-lg bg-white/10 py-1.5">Split Shipments</span>
                <span className="rounded-lg bg-white/10 py-1.5">Auto Matching</span>
                <span className="rounded-lg bg-white/10 py-1.5">Live GPS Tracking</span>
              </div>
            </div>
          </div>
      </section>

      <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-600 p-4 sm:p-6 lg:p-10">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-10 right-0 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl" aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-xl rounded-2xl border border-white/20 bg-white/12 p-4 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.55)] backdrop-blur-lg sm:p-5">
            <div className="mb-6 rounded-xl bg-white/15 p-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${mode === 'login' ? activeTabClass : inactiveTabClass}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${mode === 'register' ? activeTabClass : inactiveTabClass}`}
                >
                  Register
                </button>
              </div>
            </div>

            

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="label text-white">User ID</label>
                  <input
                    {...loginRegister('userId')}
                    className="input-field border-white/30 bg-white/95"
                    placeholder="your_user_id"
                    autoComplete="username"
                  />
                  {loginErrors.userId && <p className="error-text">{loginErrors.userId.message}</p>}
                </div>

                <div>
                  <label className="label text-white">Password</label>
                  <input
                    {...loginRegister('password')}
                    type="password"
                    className="input-field border-white/30 bg-white/95"
                    placeholder="********"
                    autoComplete="current-password"
                  />
                  {loginErrors.password && <p className="error-text">{loginErrors.password.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-100">Select Role</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { value: 'TRUCK_OWNER', icon: '🚚', label: 'Truck Owner' },
                      { value: 'BUSINESS_USER', icon: '📦', label: 'Business User' },
                      { value: 'DRIVER', icon: '👨‍💼', label: 'Driver' },
                    ].map(({ value, icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                          role === value
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-sm'
                            : 'border-white/35 bg-white/95 text-slate-600 hover:border-white/50 hover:bg-white'
                        }`}
                      >
                        <p className="text-base leading-none">{icon}</p>
                        <p className="mt-1">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label text-white">User ID</label>
                    <input {...registerField('userId')} className="input-field border-white/30 bg-white/95" placeholder="unique_username" />
                    {registerErrors.userId && <p className="error-text">{registerErrors.userId.message}</p>}
                  </div>
                  <div>
                    <label className="label text-white">Email</label>
                    <input {...registerField('email')} type="email" className="input-field border-white/30 bg-white/95" placeholder="you@example.com" />
                    {registerErrors.email && <p className="error-text">{registerErrors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label text-white">Phone</label>
                  <input {...registerField('phone')} type="tel" className="input-field border-white/30 bg-white/95" placeholder="+91-9876543210" />
                  {registerErrors.phone && <p className="error-text">{registerErrors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label text-white">Password</label>
                    <input {...registerField('password')} type="password" className="input-field border-white/30 bg-white/95" placeholder="********" />
                    {registerErrors.password && <p className="error-text">{registerErrors.password.message}</p>}
                  </div>
                  <div>
                    <label className="label text-white">Confirm Password</label>
                    <input {...registerField('confirmPassword')} type="password" className="input-field border-white/30 bg-white/95" placeholder="********" />
                    {registerErrors.confirmPassword && <p className="error-text">{registerErrors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary mt-2 w-full">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
        </div>
      </section>
    </div>
  );
}
