import React, { useState } from 'react';
import AdvancedPostSearch from '../posts/AdvancedPostSearch';
import AdvancedGroupSearch from '../groups/AdvancedGroupSearch';
import './SearchBar.css';

function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  showFilters = false,
  showAdvancedSearch = false,
  searchType = 'posts' // 'posts' or 'groups'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAdvancedDropdown, setShowAdvancedDropdown] = useState(false);

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

  const handleAdvancedSearch = (searchParams) => {
    if (onSearch) {
      onSearch(searchParams);
    }
    setShowAdvancedDropdown(false);
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
              <option value="all">All</option>
              <option value="posts">Posts</option>
              <option value="users">Users</option>
              <option value="groups">Groups</option>
            </select>
          </div>
        )}

        {showAdvancedSearch && (
          <button
            type="button"
            className={`advanced-search-toggle ${showAdvancedDropdown ? 'active' : ''}`}
            onClick={() => setShowAdvancedDropdown(!showAdvancedDropdown)}
            title="Advanced Search"
          >
            <span className="advanced-icon">⚙️</span>
            <span className="advanced-text">Advanced</span>
            <span className={`arrow-icon ${showAdvancedDropdown ? 'up' : 'down'}`}>
              {showAdvancedDropdown ? '▲' : '▼'}
            </span>
          </button>
        )}
      </form>

      {/* Advanced Search Dropdown */}
      {showAdvancedSearch && showAdvancedDropdown && (
        <div className="advanced-search-dropdown">
          {searchType === 'posts' ? (
            <AdvancedPostSearch 
              onSearch={handleAdvancedSearch}
              onClose={() => setShowAdvancedDropdown(false)}
            />
          ) : (
            <AdvancedGroupSearch 
              onSearch={handleAdvancedSearch}
              onClose={() => setShowAdvancedDropdown(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

