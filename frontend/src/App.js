import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentUser ? (
        <FeedPage 
          user={currentUser}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      ) : (
        <HomePage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
