import React, { useState } from 'react';
import SearchBar from '../components/layout/SearchBar';
import './Feed.css';

function Feed() {
  const [posts] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: '👨‍💼',
      time: '2 hours ago',
      content: 'Just completed an amazing project with my team! #teamwork #success',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: 'Sarah Smith',
      avatar: '👩‍💻',
      time: '5 hours ago',
      content: 'Excited to announce that I\'m starting a new position as Senior Developer! 🚀',
      likes: 45,
      comments: 12
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: '👨‍🔬',
      time: '1 day ago',
      content: 'Anyone interested in a tech meetup next week? Let me know!',
      likes: 18,
      comments: 8
    }
  ]);

  const handleSearch = (searchTerm, filterType) => {
    console.log('Search:', searchTerm, filterType);
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="feed-header">
          <h1>Feed</h1>
          <SearchBar 
            placeholder="Search posts, people, or topics..."
            onSearch={handleSearch}
            showFilters={true}
          />
        </div>

        <div className="create-post-card">
          <div className="create-post-input">
            <div className="user-avatar">👤</div>
            <input 
              type="text" 
              placeholder="What's on your mind?" 
              className="post-input"
            />
          </div>
          <div className="post-actions">
            <button className="post-action-btn">📷 Photo</button>
            <button className="post-action-btn">📹 Video</button>
            <button className="post-action-btn">📄 Document</button>
            <button className="post-btn">Post</button>
          </div>
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">{post.avatar}</div>
                  <div className="author-info">
                    <h3>{post.author}</h3>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
                <button className="post-menu">⋯</button>
              </div>
              
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              
              <div className="post-stats">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>
              
              <div className="post-actions-bar">
                <button className="action-btn">👍 Like</button>
                <button className="action-btn">💬 Comment</button>
                <button className="action-btn">🔄 Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;

