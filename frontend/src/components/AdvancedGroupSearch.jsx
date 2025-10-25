import React, { useState } from 'react';
import './AdvancedGroupSearch.css';

export default function AdvancedGroupSearch({ onSearch, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts & Design' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  const sizes = [
    { value: '', label: 'Any Size' },
    { value: 'small', label: 'Small (1-50 members)' },
    { value: 'medium', label: 'Medium (51-200 members)' },
    { value: 'large', label: 'Large (201-1000 members)' },
    { value: 'huge', label: 'Huge (1000+ members)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      name: groupName,
      category: category,
      size: size
    };

    onSearch(searchParams);
  };

  const handleClear = () => {
    setGroupName('');
    setCategory('');
    setSize('');
  };

  return (
    <div className="advanced-group-search">
      <div className="advanced-search-header">
        <h3>🔍 Advanced Group Search</h3>
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="advanced-search-form">
        {/* Group Name */}
        <div className="form-group">
          <label htmlFor="groupName">
            <span className="label-icon">👥</span>
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            className="form-input"
            placeholder="Search by group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">
            <span className="label-icon">🏷️</span>
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Group Size */}
        <div className="form-group">
          <label htmlFor="size">
            <span className="label-icon">📊</span>
            Group Size
          </label>
          <select
            id="size"
            className="form-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {sizes.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
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

