import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../contexts/DialogContext';
import './Register.css';
import ApiService from '../../services/api';
import PreferencesSetup from '../user/PreferencesSetup';

function Register({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const { showSuccess } = useDialog();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // בדיקה שהסיסמאות זהות
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות!');
      return;
    }

    setLoading(true);

    try {
      // יצירת אובייקט המשתמש לשליחה לשרת
      const userData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate
      };

      // שליחת בקשת הרשמה לשרת
      const response = await ApiService.register(userData);

      if (response.success) {
        console.log('✅ הרשמה הצליחה!');
        console.log('📦 Response.data:', response.data);
        console.log('🎫 Token:', response.data.token);
        console.log('👤 User:', response.data.user);
        
        // בדיקה שיש token
        if (!response.data.token) {
          console.error('❌ אין token בתגובה!');
          setError('שגיאה: לא התקבל token מהשרת');
          return;
        }
        
        // שמירת הטוקן ב-localStorage
        localStorage.setItem('token', response.data.token);
        console.log('💾 Token נשמר ב-localStorage');
        console.log('🔍 בדיקה: localStorage.getItem("token"):', localStorage.getItem('token'));
        
        // שמירת פרטי המשתמש
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('💾 פרטי משתמש נשמרו ב-localStorage');
          console.log('🔍 בדיקה: localStorage.getItem("user"):', localStorage.getItem('user'));
          
          // Show preferences setup instead of navigating immediately
          setRegisteredUser(response.data.user);
          setShowPreferences(true);
        }
      } else {
        setError(response.error || 'הרשמה נכשלה');
      }
    } catch (err) {
      setError('שגיאה בהרשמה. אנא נסה שוב.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handlePreferencesComplete = async (updatedUser) => {
    console.log('✅ Preferences completed!', updatedUser);
    
    try {
      // Update user preferences in the backend
      const response = await ApiService.updateUserPreferences(updatedUser.interests);
      
      if (response.success) {
        console.log('✅ Preferences saved to server');
      } else {
        console.warn('⚠️ Failed to save preferences to server, but continuing...');
      }
    } catch (error) {
      console.error('❌ Error saving preferences:', error);
      // Continue anyway - preferences are already saved in localStorage
    }
    
    showSuccess('נרשמת בהצלחה! 🎉', 'ברוכים הבאים');
    onClose();
    window.location.href = '/feed';
  };

  const handlePreferencesSkip = () => {
    console.log('⏭️ Preferences skipped');
    showSuccess('נרשמת בהצלחה!', 'ברוכים הבאים');
    onClose();
    window.location.href = '/feed';
  };

  return (
    <>
      {showPreferences && registeredUser && (
        <PreferencesSetup
          user={registeredUser}
          onComplete={handlePreferencesComplete}
          onSkip={handlePreferencesSkip}
        />
      )}
      
    <div className="register-overlay" onClick={onClose} style={{ display: showPreferences ? 'none' : 'flex' }}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <h1 className="register-title">Sign up</h1>
        
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
        
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              name="birthDate"
              className="form-input"
              placeholder="Birth Date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'נרשם...' : 'SIGN UP'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? 
          <button 
            className="login-button-link" 
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;

