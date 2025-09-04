import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useLoginMutation } from '../../store/api/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Login: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data).unwrap();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to manage your shops</p>
        
        <AuthForm 
          type="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/register"> Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
