import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const userInfo = {
    name: 'יוסי כהן',
    title: 'מפתח Full Stack',
    company: 'טק-סטארט',
    location: 'תל אביב, ישראל',
    email: 'yossi@example.com',
    phone: '050-1234567',
    bio: 'מפתח מנוסה עם 5 שנות ניסיון בפיתוח אפליקציות ווב ומובייל. מתמחה ב-React, Node.js ו-Python.',
    avatar: '👨‍💻',
    coverImage: '🌅',
    followers: 1250,
    following: 340,
    posts: 45
  };

  const personalPosts = [
    {
      id: 1,
      content: 'היום סיימתי פרויקט גדול שעבדתי עליו במשך 6 חודשים. זה היה אתגר מקצועי מדהים! 🚀',
      time: '2 שעות',
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: 2,
      content: 'מחפש מפתח React מנוסה לפרויקט חדש. מי שמעוניין יכול לשלוח לי הודעה פרטית!',
      time: '1 יום',
      likes: 12,
      comments: 15,
      shares: 5,
      liked: true
    },
    {
      id: 3,
      content: 'מעניין איך AI משנה את עולם הפיתוח. איך אתם רואים את העתיד של התחום?',
      time: '3 ימים',
      likes: 18,
      comments: 22,
      shares: 7,
      liked: false
    }
  ];

  const followedGroups = [
    {
      id: 1,
      name: 'מפתחי React ישראל',
      members: 1250,
      image: '⚛️',
      lastActivity: '2 שעות'
    },
    {
      id: 2,
      name: 'עסקים קטנים ובינוניים',
      members: 3200,
      image: '💼',
      lastActivity: '5 שעות'
    },
    {
      id: 3,
      name: 'שיווק דיגיטלי',
      members: 2100,
      image: '📈',
      lastActivity: '1 יום'
    }
  ];

  const handleLike = (postId) => {
    // Logic for liking posts
    console.log('Liked post:', postId);
  };

  const handleFollow = () => {
    // Logic for following user
    console.log('Followed user');
  };

  return (
    <div className="profile-container">
      {/* כותרת הפרופיל */}
      <div className="profile-header">
        <div className="cover-image">
          <div className="cover-overlay">
            <div className="profile-avatar">{userInfo.avatar}</div>
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userInfo.name}</h1>
          <p className="profile-title">{userInfo.title}</p>
          <p className="profile-company">{userInfo.company}</p>
          <p className="profile-location">📍 {userInfo.location}</p>
          <p className="profile-bio">{userInfo.bio}</p>
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{userInfo.followers}</span>
              <span className="stat-label">עוקבים</span>
            </div>
            <div className="stat">
              <span className="stat-number">{userInfo.following}</span>
              <span className="stat-label">עוקב אחרי</span>
            </div>
            <div className="stat">
              <span className="stat-number">{userInfo.posts}</span>
              <span className="stat-label">פוסטים</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="follow-button" onClick={handleFollow}>
              עקוב
            </button>
            <button className="message-button">
              שלח הודעה
            </button>
          </div>
        </div>
      </div>

      {/* טאבים */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          פוסטים שלי
        </button>
        <button 
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          קבוצות שאני עוקב
        </button>
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          מידע אישי
        </button>
      </div>

      {/* תוכן הטאבים */}
      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            <h2>הפוסטים שלי</h2>
            <div className="posts-list">
              {personalPosts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-content">
                    <p>{post.content}</p>
                    <span className="post-time">{post.time}</span>
                  </div>
                  <div className="post-actions">
                    <button 
                      className={`action-button ${post.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      👍 {post.likes}
                    </button>
                    <button className="action-button">
                      💬 {post.comments}
                    </button>
                    <button className="action-button">
                      🔄 {post.shares}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="groups-section">
            <h2>הקבוצות שאני עוקב</h2>
            <div className="groups-list">
              {followedGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-image">{group.image}</div>
                  <div className="group-info">
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-members">{group.members} חברים</p>
                    <p className="group-activity">פעילות אחרונה: {group.lastActivity}</p>
                  </div>
                  <button className="group-button">צפה בקבוצה</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="info-section">
            <h2>מידע אישי</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>שם מלא:</label>
                <span>{userInfo.name}</span>
              </div>
              <div className="info-item">
                <label>תפקיד:</label>
                <span>{userInfo.title}</span>
              </div>
              <div className="info-item">
                <label>חברה:</label>
                <span>{userInfo.company}</span>
              </div>
              <div className="info-item">
                <label>מיקום:</label>
                <span>{userInfo.location}</span>
              </div>
              <div className="info-item">
                <label>אימייל:</label>
                <span>{userInfo.email}</span>
              </div>
              <div className="info-item">
                <label>טלפון:</label>
                <span>{userInfo.phone}</span>
              </div>
            </div>
            <div className="bio-section">
              <label>אודותיי:</label>
              <p>{userInfo.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
