import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import NewPost from '../components/NewPost';
import ChatWindow from '../components/ChatWindow';
import { mockPosts, mockUsers } from '../utils/mockData';
import './FeedPage.css';

export default function FeedPage({ user, currentPage, onNavigate, onLogout }) {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const getUserById = (userId) => {
    return mockUsers.find(u => u.id === userId);
  };

  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    const postUser = getUserById(post.userId);
    return post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           postUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAvatarClick = (postUser) => {
    if (postUser.id !== user.id) {
      setSelectedChatUser(postUser);
    }
  };

  const handleCloseChatWindow = () => {
    setSelectedChatUser(null);
  };

  return (
    <div className="feed-page">
      <Header 
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
      />

      <div className="feed-container">
        <div className="feed-content">
          <div className="search-section">
            <SearchBar 
              placeholder="Search posts..."
              onSearch={handleSearch}
            />
          </div>

          <NewPost 
            user={user}
            onPostCreated={handlePostCreated}
          />

          <div className="posts-section">
            {filteredPosts.map((post) => {
              const postUser = getUserById(post.userId);
              return (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <img 
                      src={postUser?.avatar} 
                      alt={postUser?.name} 
                      className="post-avatar" 
                      onClick={() => handleAvatarClick(postUser)}
                      style={{ cursor: postUser?.id !== user.id ? 'pointer' : 'default' }}
                      title={postUser?.id !== user.id ? `שלח הודעה ל-${postUser?.name}` : ''}
                    />
                    <div className="post-info">
                      <h4 className="post-author">{postUser?.name}</h4>
                      <span className="post-time">{new Date(post.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.image && <img src={post.image} alt="Post" className="post-image" />}
                  </div>
                  <div className="post-actions">
                    <button className="action-btn">
                      <span>👍</span> {post.likes}
                    </button>
                    <button className="action-btn">
                      <span>💬</span> {post.comments}
                    </button>
                    <button className="action-btn">
                      <span>🔄</span> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />

      {/* חלונית צ'אט */}
      {selectedChatUser && (
        <ChatWindow 
          user={user}
          targetUser={selectedChatUser}
          onClose={handleCloseChatWindow}
        />
      )}
    </div>
  );
}
