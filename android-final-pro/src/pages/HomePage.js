import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Login from '../components/Login';
import Register from '../components/Register';
import './HomePage.css';

function HomePage({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSearch = (searchTerm, filterType) => {
    console.log('Search:', searchTerm, filterType);
    // TODO: Implement search logic
  };

  return (
    <div className="homepage">
      <Header 
        isLoggedIn={false}
      />

      <div className="homepage-content">
        <div className="hero-section">
          <div className="logo-container">
            <div className="hero-logo">~</div>
            <h1 className="hero-title">Welcome to MyApp</h1>
          </div>
          
          <p className="hero-subtitle">
            Connect with professionals and grow your network
          </p>

          

          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setShowRegister(true)}
            >
              Sign Up
            </button>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Connect</h3>
              <p>Build your professional network</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Collaborate</h3>
              <p>Work together on projects</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Grow</h3>
              <p>Expand your opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
}

export default HomePage;

