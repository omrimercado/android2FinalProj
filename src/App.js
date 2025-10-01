import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import GroupsSearch from './components/GroupsSearch';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('feed'); // 'login', 'register', 'feed', 'groups', 'profile'

  const switchToLogin = () => setCurrentPage('login');
  const switchToRegister = () => setCurrentPage('register');
  const switchToFeed = () => setCurrentPage('feed');
  const switchToGroups = () => setCurrentPage('groups');
  const switchToProfile = () => setCurrentPage('profile');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onSwitchToRegister={switchToRegister} />;
      case 'register':
        return <Register onSwitchToLogin={switchToLogin} />;
      case 'groups':
        return <GroupsSearch />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="App">
      {/* ניווט עליון */}
      {currentPage !== 'login' && currentPage !== 'register' && (
        <nav className="main-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <h2>הפלטפורמה שלי</h2>
            </div>
            <div className="nav-links">
              <button 
                className={`nav-link ${currentPage === 'feed' ? 'active' : ''}`}
                onClick={switchToFeed}
              >
                🏠 פיד
              </button>
              <button 
                className={`nav-link ${currentPage === 'groups' ? 'active' : ''}`}
                onClick={switchToGroups}
              >
                👥 קבוצות
              </button>
              <button 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={switchToProfile}
              >
                👤 פרופיל
              </button>
            </div>
            <div className="nav-actions">
              <button className="logout-btn" onClick={switchToLogin}>
                התנתק
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* תוכן הדף */}
      {renderPage()}
    </div>
  );
}

export default App;
