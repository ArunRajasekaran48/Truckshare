import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validators';

/**
 * LoginForm
 * Reusable login form component — no navigation logic, pure UI.
 * @prop {Function} onSubmit - called with { userId, password }
 * @prop {boolean} isLoading
 * @prop {string} error - server-level error message
 */
export function LoginForm({ onSubmit, isLoading, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="label">User ID</label>
        <input
          {...register('userId')}
          className="input-field"
          placeholder="your_user_id"
          autoComplete="username"
        />
        {errors.userId && <p className="error-text">{errors.userId.message}</p>}
      </div>

      <div>
        <label className="label">Password</label>
        <input
          {...register('password')}
          type="password"
          className="input-field"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5">
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
