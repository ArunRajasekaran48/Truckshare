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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🚛</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join TruckShare today</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { value: 'TRUCK_OWNER', icon: '🚚', label: 'Truck Owner' },
              { value: 'BUSINESS_USER', icon: '📦', label: 'Business' },
              { value: 'DRIVER', icon: '🧑‍✈️', label: 'Driver' },
            ].map(({ value, icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  role === value ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <p className="text-2xl mb-1">{icon}</p>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { label: 'User ID', name: 'userId', type: 'text', placeholder: 'unique_username' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91-9876543210' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="input-field"
                />
                {errors[name] && <p className="error-text">{errors[name].message}</p>}
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
