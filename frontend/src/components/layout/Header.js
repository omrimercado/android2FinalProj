import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ currentPage, onNavigate, onLogout, isLoggedIn = false, user = null }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleNavigate = (page) => {
    if (page === 'feed') {
      navigate('/feed');
    } else if (page === 'profile') {
      navigate('/profile');
    } else if (page === 'groups') {
      navigate('/groups');
    } else if (page === 'statistics') {
      navigate('/statistics');
    }
  };

  // Check if user is admin
  const isAdmin = user && user.email === 'admin@master.com';

  return (
    <header className="header">
      <div className={`header-container ${!isLoggedIn ? 'header-logo-only' : ''}`}>
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">~</div>
          <span className="logo-text">MyApp</span>
        </div>
        
        {/* Navigation Menu - Only show when logged in */}
        {isLoggedIn && (
          <>
            <nav className="header-nav">
              <button 
                className={`nav-link ${currentPage === 'feed' ? 'active' : ''}`}
                onClick={() => handleNavigate('feed')}
              >
                Feed
              </button>
              
              <button 
                className={`nav-link ${currentPage === 'groups' ? 'active' : ''}`}
                onClick={() => handleNavigate('groups')}
              >
                Groups
              </button>
              
              <button 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavigate('profile')}
              >
                My Profile
              </button>

              {/* Statistics button - Only visible to admin */}
              {isAdmin && (
                <button 
                  className={`nav-link admin-link ${currentPage === 'statistics' ? 'active' : ''}`}
                  onClick={() => handleNavigate('statistics')}
                >
                  📊 Statistics
                </button>
              )}
            </nav>
            
            {/* Logout Button */}
            <div className="header-actions">
              <button className="auth-button" onClick={handleLogout}>
                Logout →
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
