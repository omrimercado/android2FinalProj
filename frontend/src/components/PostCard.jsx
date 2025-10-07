import React from 'react';
import './PostCard.css';

export default function PostCard({ post }) {
  return (
    <div className="postcard-container">
      <div className="postcard-header">
        <img src={post.avatar} alt="avatar" className="postcard-avatar" />
        <div>
          <div className="postcard-username">{post.username}</div>
          <div className="postcard-handle">@{post.handle} · {post.time}</div>
          <p className="postcard-text">{post.text}</p>
          {post.image && <img src={post.image} alt="post" className="postcard-image" />}
          <div className="postcard-actions">
            <span>💬 {post.comments}</span>
            <span>🔁 {post.retweets}</span>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}