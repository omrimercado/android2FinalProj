import React, { useState } from 'react';
import { authenticateUser } from '../utils/mockData';
import './Login.css';

function Login({ onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const result = authenticateUser(email, password);
    
    if (result.success) {
      console.log('Login successful:', result.user);
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    console.log('Google Sign In');
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <h1 className="login-title">Sign in</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="demo-credentials">
          <p><strong>Demo Users:</strong></p>
          <p>📧 test@test.com | 🔑 test</p>
          <p>📧 john@example.com | 🔑 123456</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
              />
              <span className="checkbox-text">Remember password</span>
            </label>
          </div>

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <div className="divider">
          <span className="divider-line"></span>
        </div>

        <button className="google-button" onClick={handleGoogleSignIn}>
          <span className="google-icon">G</span>
          SIGN IN WITH GOOGLE
        </button>

        <div className="signup-link">
          Don't have an account? 
          <button 
            className="signup-button" 
            onClick={onSwitchToRegister}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

