import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import MyProfilePage from './pages/MyProfilePage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  console.log('🎨 App.js render - isLoggedIn:', isLoggedIn, 'user:', user);
  
  return (
    <Router>
      <div className="App">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
