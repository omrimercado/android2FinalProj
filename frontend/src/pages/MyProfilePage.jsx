import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import ChangeImage from '../components/ChangeImage';
import './MyProfilePage.css';

export default function MyProfilePage({ user, currentPage, onNavigate, onLogout }) {
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || 'https://i.pravatar.cc/150?img=1');
  // Mock data for join requests
  const [joinRequests] = useState([
    {
      id: 1,
      userName: 'Sarah Cohen',
      userAvatar: 'https://i.pravatar.cc/150?img=10',
      groupName: 'React Developers Israel',
      requestDate: '2 hours ago'
    },
    {
      id: 2,
      userName: 'David Levi',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      groupName: 'Tech Entrepreneurs',
      requestDate: '5 hours ago'
    },
    {
      id: 3,
      userName: 'Rachel Ben-David',
      userAvatar: 'https://i.pravatar.cc/150?img=15',
      groupName: 'React Developers Israel',
      requestDate: '1 day ago'
    }
  ]);

  // Mock data for user's posts
  const [myPosts] = useState([
    {
      id: 1,
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
      group: 'React Developers Israel',
      username: user?.name || 'John Doe',
      handle: user?.email?.split('@')[0] || 'johndoe',
      time: '2h',
      text: 'Just launched my new React project! 🚀 Would love to get some feedback from the community.',
      image: 'https://picsum.photos/600/400?random=1',
      comments: 12,
      retweets: 5,
      likes: 34
    },
    {
      id: 2,
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
      group: 'Tech Entrepreneurs',
      username: user?.name || 'John Doe',
      handle: user?.email?.split('@')[0] || 'johndoe',
      time: '5h',
      text: 'Working on something exciting! Stay tuned for updates 👀',
      image: null,
      comments: 8,
      retweets: 3,
      likes: 21
    },
    {
      id: 3,
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
      group: 'UI/UX Designers',
      username: user?.name || 'John Doe',
      handle: user?.email?.split('@')[0] || 'johndoe',
      time: '1d',
      text: 'Anyone interested in collaborating on an open source project? Looking for developers and designers!',
      image: null,
      comments: 15,
      retweets: 8,
      likes: 42
    }
  ]);

  const handleApprove = (requestId) => {
    console.log('Approved request:', requestId);
    // TODO: Implement approve logic
  };

  const handleReject = (requestId) => {
    console.log('Rejected request:', requestId);
    // TODO: Implement reject logic
  };

  const handleSaveImage = (newImageUrl) => {
    console.log('Saving new image:', newImageUrl);
    setCurrentAvatar(newImageUrl);
    
    // TODO: שליחת התמונה החדשה לשרת
    // שמירה ב-localStorage לעת עתה
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    savedUser.avatar = newImageUrl;
    localStorage.setItem('user', JSON.stringify(savedUser));
  };

  return (
    <div className="myprofile-page">
      <Header 
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
      />

      <div className="myprofile-container">
        <div className="myprofile-content">
          {/* User Info Section */}
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={currentAvatar} 
                alt={user?.name || 'User'} 
                className="profile-avatar"
                onClick={() => setShowChangeImage(true)}
              />
              <div className="avatar-overlay" onClick={() => setShowChangeImage(true)}>
                <span className="camera-icon">📷</span>
                <span className="change-text">Change Photo</span>
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name || 'John Doe'}</h1>
              <p className="profile-email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Join Requests Section */}
          {joinRequests.length > 0 && (
            <div className="requests-section">
              <h2 className="section-title">📋 Group Join Requests</h2>
              <p className="section-subtitle">Requests from users who want to join groups you admin</p>
              
              <div className="requests-list">
                {joinRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <img 
                      src={request.userAvatar} 
                      alt={request.userName} 
                      className="request-avatar"
                    />
                    <div className="request-info">
                      <h3 className="request-username">{request.userName}</h3>
                      <p className="request-details">
                        wants to join <strong>{request.groupName}</strong>
                      </p>
                      <span className="request-time">{request.requestDate}</span>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprove(request.id)}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(request.id)}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Posts Section */}
          <div className="posts-section">
            <h2 className="section-title">📝 My Posts</h2>
            <p className="section-subtitle">All posts you've shared</p>
            
            <div className="posts-list">
              {myPosts.length > 0 ? (
                myPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="no-posts">
                  <p>You haven't posted anything yet.</p>
                  <button className="btn-create-post">Create your first post</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Change Image Modal */}
      {showChangeImage && (
        <ChangeImage
          currentImage={currentAvatar}
          onClose={() => setShowChangeImage(false)}
          onSave={handleSaveImage}
        />
      )}
    </div>
  );
}

