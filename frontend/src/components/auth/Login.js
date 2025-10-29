import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import ApiService from '../../services/api';

function Login({ onClose, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('=== התחלת תהליך התחברות ===');
    console.log('📧 Email:', email);
    console.log('🔐 Password length:', password.length);
    
    setLoading(true);
    setError('');

    try {
      console.log('Sending login request to server...');
      console.log('URL:', 'http://localhost:3001/api/auth/login');
      console.log('Body:', JSON.stringify({ email, password: '***' }));
      
      // שליחת בקשת התחברות לשרת
      const response = await ApiService.login(email, password);
      
      console.log('Response from server:', response);

      if (response.success) {
        console.log('Login successful!');
        console.log('Response.data:', response.data);
        console.log('Token:', response.data.token);
        console.log('User:', response.data.user);
        
        // בדיקה שיש token
        if (!response.data.token) {
          console.error('No token in response!');
          setError('Error: No token received from server');
          return;
        }
        
        // שמירת הטוקן ב-localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token saved in localStorage');
        console.log('Check: localStorage.getItem("token"):', localStorage.getItem('token'));
        
        // שמירת פרטי המשתמש
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('User details saved in localStorage');
          console.log('Check: localStorage.getItem("user"):', localStorage.getItem('user'));
        }

        
        
       
        window.location.href = '/feed';
      } else {
        console.log('Login failed');
        console.log('Error:', response.error);
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      console.log('Error in login process:');
      console.error('Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError('Error in login. Please try again.');
    } finally {
      setLoading(false);
      console.log('=== סיום תהליך התחברות ===');
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <h1 className="login-title">Sign in</h1>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}

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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'מתחבר...' : 'LOGIN'}
          </button>
        </form>

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

