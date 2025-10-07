import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ placeholder = "Search...", onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="searchbar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        className="searchbar-input"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <button className="clear-btn" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
}
