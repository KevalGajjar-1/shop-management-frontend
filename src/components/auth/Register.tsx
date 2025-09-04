import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useRegisterMutation } from '../../store/api/authApi';
import toast from 'react-hot-toast';
import { RegisterFormData } from '../../types';

const Register: React.FC = () => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (data: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData as RegisterFormData).unwrap();
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err: any) {
      // Handle RTK Query error types properly
      const errorMessage = err?.data?.message || err?.message || 'Registration failed';
      toast.error(errorMessage);
    }
  };

  // Handle RTK Query error properly
  const errorMessage = error && 'data' in error 
    ? (error.data as any)?.message 
    : error && 'message' in error 
    ? error.message 
    : undefined;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Start managing your shops today</p>
        
        <AuthForm 
          type="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={errorMessage}
        />

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login"> Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
