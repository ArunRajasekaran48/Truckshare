import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { UIContext } from '@/context/UIContext';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const { toast } = useContext(UIContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async ({ userId, password }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-block bg-white rounded-2xl p-4 shadow-xl mb-4">
            <span className="text-5xl block">🚛</span>
          </div>
          <h1 className="text-4xl font-bold text-white mt-4">TruckShare</h1>
          <p className="text-blue-100 text-base mt-2 font-medium">Logistics Simplified</p>
        </div>

        <div className="card-elevated p-8 border-2 border-white/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="label text-slate-700">User ID</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4">
                  <span className="text-blue-600">👤</span>
                </div>
                <input
                  {...register('userId')}
                  className="input-field pl-12 border-blue-300 focus:border-blue-500"
                  placeholder="your_user_id"
                  autoComplete="username"
                />
              </div>
              {errors.userId && <p className="error-text">{errors.userId.message}</p>}
            </div>

            <div>
              <label className="label text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4">
                  <span className="text-blue-600">🔐</span>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="input-field pl-12 border-blue-300 focus:border-blue-500"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base">
              {isLoading ? '⏳ Signing in…' : '🚀 Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-blue-100">
            <p className="text-center text-sm text-slate-600">
              New to TruckShare?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
