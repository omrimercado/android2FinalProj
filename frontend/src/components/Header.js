import React from 'react';
import './Header.css';

function Header({ currentPage, onNavigate, onLogout, isLoggedIn = false }) {
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
                onClick={() => onNavigate('feed')}
              >
                Feed
              </button>
              
              <button 
                className={`nav-link ${currentPage === 'groups' ? 'active' : ''}`}
                onClick={() => onNavigate('groups')}
              >
                Groups
              </button>
              
              <button 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => onNavigate('profile')}
              >
                My Profile
              </button>
            </nav>
            
            {/* Logout Button */}
            <div className="header-actions">
              <button className="auth-button" onClick={onLogout}>
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
