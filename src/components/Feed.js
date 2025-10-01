import React, { useState } from 'react';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'דוד כהן',
        title: 'מנהל פיתוח תוכנה',
        company: 'טק-סטארט',
        avatar: '👨‍💼',
        time: '2 שעות'
      },
      content: 'היום סיימתי פרויקט גדול שעבדתי עליו במשך 6 חודשים. זה היה אתגר מקצועי מדהים! 🚀',
      image: null,
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: 2,
      author: {
        name: 'שרה לוי',
        title: 'מעצבת UX/UI',
        company: 'דיזיין-פרו',
        avatar: '👩‍🎨',
        time: '4 שעות'
      },
      content: 'מחפש/ת מעצב/ת UX מנוסה לפרויקט חדש. מי שמעוניין יכול לשלוח לי הודעה פרטית!',
      image: null,
      likes: 12,
      comments: 15,
      shares: 5,
      liked: false
    },
    {
      id: 3,
      author: {
        name: 'מיכאל גולד',
        title: 'אנליסט נתונים',
        company: 'דאטה-סמארט',
        avatar: '👨‍💻',
        time: '6 שעות'
      },
      content: 'מעניין איך AI משנה את עולם הנתונים. איך אתם רואים את העתיד של התחום?',
      image: null,
      likes: 18,
      comments: 22,
      shares: 7,
      liked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleShare = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: {
          name: 'אני',
          title: 'משתמש',
          company: 'החברה שלי',
          avatar: '👤',
          time: 'עכשיו'
        },
        content: newPost,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>הפיד שלי</h1>
      </div>

      {/* יצירת פוסט חדש */}
      <div className="create-post">
        <div className="create-post-header">
          <div className="user-avatar">👤</div>
          <form onSubmit={handleNewPost} className="post-form">
            <input
              type="text"
              placeholder="מה אתה חושב על זה?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="post-input"
            />
            <button type="submit" className="post-button">פרסם</button>
          </form>
        </div>
      </div>

      {/* רשימת פוסטים */}
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">{post.author.avatar}</div>
                <div className="author-info">
                  <h3 className="author-name">{post.author.name}</h3>
                  <p className="author-title">{post.author.title}</p>
                  <p className="author-company">{post.author.company}</p>
                  <span className="post-time">{post.author.time}</span>
                </div>
              </div>
              <button className="more-options">⋯</button>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            <div className="post-stats">
              <span className="likes-count">{post.likes} לייקים</span>
              <span className="comments-count">{post.comments} תגובות</span>
              <span className="shares-count">{post.shares} שיתופים</span>
            </div>

            <div className="post-actions">
              <button 
                className={`action-button ${post.liked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                👍 {post.liked ? 'אהבתי' : 'לייק'}
              </button>
              <button className="action-button">
                💬 תגובה
              </button>
              <button 
                className="action-button"
                onClick={() => handleShare(post.id)}
              >
                🔄 שתף
              </button>
              <button className="action-button">
                📤 שלח
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
