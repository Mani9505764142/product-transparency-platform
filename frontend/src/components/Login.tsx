import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up the user
        await signUp(email, password);
        
        // Auto sign-in after successful signup
        await signIn(email, password);
        
        // Welcome message and redirect
        alert('Welcome! Your account has been created successfully.');
        navigate('/');
      } else {
        // Regular sign in
        await signIn(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="auth-subtitle">
          {isSignUp ? 'Sign up to start tracking product transparency' : 'Sign in to your account'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="link-button">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
