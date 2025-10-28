import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DialogProvider } from './contexts/DialogContext';
import DialogContainer from './components/common/DialogContainer';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import MyProfilePage from './pages/MyProfilePage';
import GroupsPage from './pages/GroupsPage';
import StatisticsPage from './pages/StatisticsPage';
import useInactivityTimeout from './hooks/useInactivityTimeout';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Handle automatic logout on inactivity
  const handleInactivityTimeout = () => {
    console.log('⏱️ Inactivity timeout - Auto logout');
    setShowTimeoutWarning(true);
    
    // Show warning for 3 seconds before logging out
    setTimeout(() => {
      handleLogout();
      setShowTimeoutWarning(false);
    }, 3000);
  };

  // Set up inactivity timeout (10 minutes)
  // Only active when user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      // If not logged in, clean up activity tracking
      localStorage.removeItem('lastActivityTime');
    }
  }, [isLoggedIn]);

  // Hook is always called, but only functional when logged in
  useInactivityTimeout(
    isLoggedIn ? handleInactivityTimeout : () => {}, // No-op when not logged in
    10 // 10 minutes
  );

  useEffect(() => {
    console.log('🔄 App.js - useEffect התחיל');
    // בדיקה אם המשתמש מחובר
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 Token from localStorage:', token);
    console.log('🔍 User from localStorage:', savedUser);
    
    if (token && savedUser) {
      console.log('✅ משתמש מחובר - מעדכן state');
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    } else {
      console.log('❌ משתמש לא מחובר');
    }
  }, []);

  const handleLogout = () => {
    console.log('👋 Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivityTime'); // Clean up activity tracking
    setIsLoggedIn(false);
    setUser(null);
  };

  console.log('🎨 App.js render - isLoggedIn:', isLoggedIn, 'user:', user);

  return (
    <DialogProvider>
      <Router>
        <div className="App">
          {/* Dialog Container */}
          <DialogContainer />

          {/* Inactivity Timeout Warning */}
          {showTimeoutWarning && (
            <div className="timeout-warning-banner">
              <div className="timeout-warning-content">
                ⏱️ Your session has expired due to inactivity. Logging out...
              </div>
            </div>
          )}

          <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? <Navigate to="/feed" replace /> : <HomePage />
            } 
          />
          <Route 
            path="/feed" 
            element={
              isLoggedIn ? (
                <FeedPage 
                  user={user} 
                  currentPage="feed"
                  onNavigate={() => {}}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? (
                <MyProfilePage 
                  user={user} 
                  currentPage="profile"
                  onNavigate={() => {}}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/groups" 
            element={
              isLoggedIn ? (
                <GroupsPage 
                  user={user} 
                  currentPage="groups"
                  onNavigate={() => {}}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/statistics" 
            element={
              isLoggedIn && user && user.email === 'admin@master.com' ? (
                <StatisticsPage 
                  user={user} 
                  currentPage="statistics"
                  onNavigate={() => {}}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/feed" replace />
              )
            } 
          />  
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </DialogProvider>
  );
}

export default App;
