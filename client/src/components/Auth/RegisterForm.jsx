import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/utils/validators';

/**
 * RegisterForm
 * Step-1: choose role. Step-2: fill details.
 * @prop {Function} onSubmit - called with complete form data including role
 * @prop {boolean} isLoading
 * @prop {string} error
 */
export function RegisterForm({ onSubmit, isLoading, error }) {
  const [role, setRole] = useState('BUSINESS_USER');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: 'BUSINESS_USER' },
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, role });
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Role selector */}
      <div>
        <p className="label mb-2">I am a…</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                role === value
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <p className="text-2xl mb-1">{icon}</p>
              {label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        {[
          { label: 'User ID', name: 'userId', type: 'text', placeholder: 'unique_username', autoComplete: 'username' },
          { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
          { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91-9876543210' },
          { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
        ].map(({ label, name, type, placeholder, autoComplete }) => (
          <div key={name}>
            <label className="label">{label}</label>
            <input
              {...register(name)}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="input-field"
            />
            {errors[name] && <p className="error-text">{errors[name].message}</p>}
          </div>
        ))}

        {/* Password strength hint */}
        <p className="text-xs text-gray-400">
          Password must be 8+ characters with at least one uppercase letter and one number.
        </p>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5">
          {isLoading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
