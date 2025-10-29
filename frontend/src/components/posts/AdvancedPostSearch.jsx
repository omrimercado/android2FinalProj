import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import './AdvancedPostSearch.css';

export default function AdvancedPostSearch({ onSearch, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all_my_groups');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const result = await ApiService.getMyGroups();
      
      if (result.success && result.data && Array.isArray(result.data.groups)) {
        setMyGroups(result.data.groups);
      } else {
        setMyGroups([]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setMyGroups([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      query: searchQuery,
      groupFilter: groupFilter === 'specific' ? selectedGroup : groupFilter,
      dateRange: dateRange,
      sortBy: sortBy
    };

    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchQuery('');
    setGroupFilter('all_my_groups');
    setSelectedGroup('');
    setDateRange('all');
    setSortBy('newest');
  };

  return (
    <div className="advanced-post-search">
      <div className="advanced-search-header">
        <h3>🔍 Advanced Post Search</h3>
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="advanced-search-form">
        {/* Search Query */}
        <div className="form-group">
          <label htmlFor="searchQuery">
            <span className="label-icon">💬</span>
            Search Keywords
          </label>
          <input
            type="text"
            id="searchQuery"
            className="form-input"
            placeholder="Search in posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Group Filter */}
        <div className="form-group">
          <label>
            <span className="label-icon">📁</span>
            Groups
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="groupFilter"
                value="all_my_groups"
                checked={groupFilter === 'all_my_groups'}
                onChange={(e) => setGroupFilter(e.target.value)}
              />
              <span>All My Groups</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="groupFilter"
                value="specific"
                checked={groupFilter === 'specific'}
                onChange={(e) => setGroupFilter(e.target.value)}
              />
              <span>Select Specific</span>
            </label>
          </div>
          {groupFilter === 'specific' && (
            <select
              className="form-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Choose a group...</option>
              {myGroups.map(group => (
                <option key={group._id || group.id} value={group._id || group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date Range */}
        <div className="form-group">
          <label htmlFor="dateRange">
            <span className="label-icon">📅</span>
            Date Range
          </label>
          <select
            id="dateRange"
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group">
          <label htmlFor="sortBy">
            <span className="label-icon">📊</span>
            Sort By
          </label>
          <select
            id="sortBy"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_commented">Most Commented</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" onClick={handleClear} className="btn-clear">
            Clear
          </button>
          <button type="submit" className="btn-search">
            🔍 Search
          </button>
        </div>
      </form>
    </div>
  );
}

