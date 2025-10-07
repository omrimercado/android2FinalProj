import React from 'react';
import './SearchBar.css';

export default function SearchBar() {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search..."
        className="searchbar-input"
      />
    </div>
  );
}