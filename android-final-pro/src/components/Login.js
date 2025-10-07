import React, { useState } from 'react';
import './Login.css';

function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', { email, password, rememberPassword });
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

