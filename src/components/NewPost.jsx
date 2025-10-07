import React, { useState } from 'react';
import './NewPost.css';

function NewPost({ user, onPostCreated }) {
  const [postContent, setPostContent] = useState('');

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      userId: user.id,
      content: postContent,
      image: null,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
    };
    
    if (onPostCreated) {
      onPostCreated(newPost);
    }
    
    setPostContent('');
  };

  return (
    <div className="new-post-section">
      <div className="new-post-box">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          className="new-post-input"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
        />
      </div>
      <div className="new-post-actions">
        <button 
          className="post-button"
          onClick={handleCreatePost}
          disabled={!postContent.trim()}
        >
          POST
        </button>
      </div>
    </div>
  );
}

export default NewPost;
