import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ placeholder = "חפש...", onSearch, showFilters = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, filterType);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // חיפוש בזמן אמת (אופציונלי)
    if (onSearch) {
      onSearch(value, filterType);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setSearchTerm('');
                if (onSearch) onSearch('', filterType);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {showFilters && (
          <div className="search-filters">
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                if (onSearch) onSearch(searchTerm, e.target.value);
              }}
            >
              <option value="all">הכל</option>
              <option value="posts">פוסטים</option>
              <option value="users">משתמשים</option>
              <option value="groups">קבוצות</option>
            </select>
          </div>
        )}

        <button type="submit" className="search-button">
          חפש
        </button>
      </form>
    </div>
  );
}

export default SearchBar;

