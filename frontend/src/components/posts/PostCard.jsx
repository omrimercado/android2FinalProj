import React from 'react';
import './PostCard.css';

export default function PostCard({ post }) {
  return (
    <div className="postcard-container">
      <div className="postcard-header">
        <img src={post.avatar} alt="avatar" className="postcard-avatar" />
        <div>
          <div className="postcard-group">{post.group}</div>
          <div className="postcard-username">{post.username}</div>
          <div className="postcard-handle">@{post.handle} · {post.time}</div>
          <p className="postcard-text">{post.text}</p>
          {post.image && <img src={post.image} alt="post" className="postcard-image" />}
          {post.video && (
            <video controls className="postcard-video">
              <source src={post.video} type="video/mp4" />
              <source src={post.video} type="video/webm" />
              <source src={post.video} type="video/ogg" />
              Your browser doesn't support the video tag.
            </video>
          )}
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