import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { UIContext } from '@/context/UIContext';

export function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useContext(UIContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('BUSINESS_USER');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: 'BUSINESS_USER' },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({ ...data, role });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-5 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-12 left-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          {/* <div className="inline-block bg-white rounded-2xl p-4 shadow-xl mb-4">
            <span className="text-5xl block">🚛</span>
          </div> */}
          <h1 className="text-4xl font-bold text-white mt-4">Join TruckShare</h1>
          <p className="text-blue-100 text-base mt-2 font-medium">Register your account</p>
        </div>

        <div className="card-elevated p-8 border-2 border-white/20 backdrop-blur-xl">
          {/* Role selector */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Select Your Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    className={`py-4 rounded-xl border-2 text-sm font-bold transition-all transform hover:scale-105 ${
                      role === value ? `${colors[color]} shadow-lg ring-2 ring-offset-2 ring-${color}-400` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-3xl mb-2">{icon}</p>
                    <p>{label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'User ID', name: 'userId', type: 'text', placeholder: 'unique_username', icon: '👤' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', icon: '📧' },
              ].map(({ label, name, type, placeholder, icon }) => (
                <div key={name}>
                  <label className="label text-slate-700">{label}</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600">{icon}</div>
                    <input
                      {...register(name)}
                      type={type}
                      placeholder={placeholder}
                      className="input-field pl-12 border-blue-300"
                    />
                  </div>
                  {errors[name] && <p className="error-text">{errors[name].message}</p>}
                </div>
              ))}
            </div>

            {[
              { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91-9876543210', icon: '📱' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', icon: '🔐' },
              { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••', icon: '✓' },
            ].map(({ label, name, type, placeholder, icon }) => (
              <div key={name}>
                <label className="label text-slate-700">{label}</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-blue-600">{icon}</div>
                  <input
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    className="input-field pl-12 border-blue-300"
                  />
                </div>
                {errors[name] && <p className="error-text">{errors[name].message}</p>}
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base mt-6">
              {isLoading ? '⏳ Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-blue-100">
            <p className="text-center text-sm text-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
