import React, { useState } from 'react';
import './GroupsSearch.css';

const GroupsSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'הכל' },
    { id: 'tech', name: 'טכנולוגיה' },
    { id: 'business', name: 'עסקים' },
    { id: 'design', name: 'עיצוב' },
    { id: 'marketing', name: 'שיווק' },
    { id: 'education', name: 'חינוך' }
  ];

  const groups = [
    {
      id: 1,
      name: 'מפתחי React ישראל',
      description: 'קבוצה למפתחי React בישראל. שיתוף ידע, שאלות ותשובות, ופרויקטים מעניינים.',
      members: 1250,
      posts: 45,
      category: 'tech',
      image: '⚛️',
      isFollowing: false
    },
    {
      id: 2,
      name: 'עסקים קטנים ובינוניים',
      description: 'קבוצה לבעלי עסקים קטנים ובינוניים. טיפים, עצות וקישורים עסקיים.',
      members: 3200,
      posts: 78,
      category: 'business',
      image: '💼',
      isFollowing: true
    },
    {
      id: 3,
      name: 'מעצבים גרפיים',
      description: 'קבוצה למעצבים גרפיים. עבודות, השראה וטיפים מקצועיים.',
      members: 890,
      posts: 23,
      category: 'design',
      image: '🎨',
      isFollowing: false
    },
    {
      id: 4,
      name: 'שיווק דיגיטלי',
      description: 'קבוצה למומחי שיווק דיגיטלי. טיפים, כלים וטרנדים חדשים.',
      members: 2100,
      posts: 56,
      category: 'marketing',
      image: '📈',
      isFollowing: true
    },
    {
      id: 5,
      name: 'מורים ומורות',
      description: 'קבוצה למורים ומורות. שיתוף חומרי לימוד, דיונים פדגוגיים וטיפים.',
      members: 1500,
      posts: 34,
      category: 'education',
      image: '👩‍🏫',
      isFollowing: false
    }
  ];

  const [groupsList, setGroupsList] = useState(groups);

  const handleFollow = (groupId) => {
    setGroupsList(groupsList.map(group => 
      group.id === groupId 
        ? { ...group, isFollowing: !group.isFollowing }
        : group
    ));
  };

  const filteredGroups = groupsList.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="groups-search-container">
      <div className="groups-header">
        <h1>חיפוש קבוצות</h1>
        <p>גלה קבוצות מעניינות והצטרף לקהילה</p>
      </div>

      {/* חיפוש וסינון */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="חפש קבוצות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>

        <div className="categories-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* רשימת קבוצות */}
      <div className="groups-list">
        {filteredGroups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <div className="group-image">{group.image}</div>
              <div className="group-info">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-description">{group.description}</p>
                <div className="group-stats">
                  <span className="members-count">{group.members} חברים</span>
                  <span className="posts-count">{group.posts} פוסטים</span>
                </div>
              </div>
            </div>
            <div className="group-actions">
              <button 
                className={`follow-button ${group.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollow(group.id)}
              >
                {group.isFollowing ? '✓ עוקב' : '+ עקוב'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="no-results">
          <p>לא נמצאו קבוצות המתאימות לחיפוש שלך</p>
        </div>
      )}
    </div>
  );
};

export default GroupsSearch;
