import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void; // Make this more flexible
  isLoading: boolean;
  error?: string | null; // Allow null values
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  type, 
  onSubmit, 
  isLoading, 
  error 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = type === 'register';

  // Use conditional typing based on form type
  const { register, handleSubmit, formState: { errors }, watch } = useForm<
    typeof isRegister extends true ? RegisterFormData : LoginFormData
  >();

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {isRegister && (
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            {...register('name' as any, {
              required: isRegister ? 'Name is required' : false,
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className={(errors as any).name ? 'error' : ''}
          />
          {(errors as any).name && <span className="error-text">{(errors as any).name.message}</span>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email'
            }
          })}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className={errors.password ? 'error' : ''}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <span className="error-text">{errors.password.message}</span>}
      </div>

      {isRegister && (
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword' as any, {
              required: 'Please confirm your password',
              validate: (value: string) => value === password || 'Passwords do not match'
            })}
            className={(errors as any).confirmPassword ? 'error' : ''}
          />
          {(errors as any).confirmPassword && (
            <span className="error-text">{(errors as any).confirmPassword.message}</span>
          )}
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <button 
        type="submit" 
        disabled={isLoading}
        className="auth-submit-btn"
      >
        {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
      </button>
    </form>
  );
};

export default AuthForm;
