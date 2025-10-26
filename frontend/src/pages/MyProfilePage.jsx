import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostCard from '../components/posts/PostCard';
import ChangeImage from '../components/user/ChangeImage';
import NewPost from '../components/posts/NewPost';
import ApiService from '../services/api';
import { getAvatar } from '../utils/helpers';
import './MyProfilePage.css';

export default function MyProfilePage({ user, currentPage, onNavigate, onLogout }) {
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(getAvatar(user?.avatar, user?.name));

  // State for join requests - now organized by groups
  const [adminGroups, setAdminGroups] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // State for user's posts
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // State for editing posts
  const [editingPost, setEditingPost] = useState(null);
  const [isDeletingPostId, setIsDeletingPostId] = useState(null);

  // Fetch join requests and user posts when component mounts
  useEffect(() => {
    fetchJoinRequests();
    fetchUserPosts();
  }, [user]);

  // Fetch user's posts from API
  const fetchUserPosts = async () => {
    if (!user || !user.id) {
      console.warn('No user ID available');
      setIsLoadingPosts(false);
      return;
    }

    setIsLoadingPosts(true);
    setPostsError(null);

    try {
      const response = await ApiService.getUserPosts(user.id);

      if (response.success) {
        // Backend returns { data: { posts: [...], count: n } }
        const postsData = response.data.posts || response.data || [];
        setMyPosts(postsData);
      } else {
        setPostsError(response.message || 'Failed to load posts');
      }
    } catch (err) {
      setPostsError('An error occurred while loading posts');
      console.error('Error fetching user posts:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || requestsError) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setRequestsError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, requestsError]);

  // Fetch all join requests for groups the user admins
  const fetchJoinRequests = async () => {
    setIsLoadingRequests(true);
    setRequestsError(null);

    try {
      const result = await ApiService.getAdminGroupsWithRequests();

      if (result.success) {
        // Transform the data from the server format to component format
        // API returns: { groups: [{ _id, name, pendingRequests: [{ userId: {...}, requestedAt }] }] }
        const groupsWithRequests = [];

        if (result.data && result.data.groups) {
          result.data.groups.forEach(group => {
            // Only include groups that have pending requests
            if (group.pendingRequests && group.pendingRequests.length > 0) {
              const transformedRequests = group.pendingRequests.map(request => ({
                id: `${group._id || group.id}-${request.userId._id || request.userId.id}`, // Unique ID combining group and user
                groupId: group._id || group.id,
                userId: request.userId._id || request.userId.id,
                userName: request.userId.name || 'Anonymous User',
                userAvatar: getAvatar(request.userId.avatar, request.userId.name),
                requestDate: new Date(request.requestedAt).toLocaleString()
              }));

              groupsWithRequests.push({
                groupId: group._id || group.id,
                groupName: group.name,
                requests: transformedRequests
              });
            }
          });
        }

        setAdminGroups(groupsWithRequests);
      } else {
        setRequestsError(result.message || 'Failed to load join requests');
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
      setRequestsError('An error occurred while loading requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleApprove = async (requestId, groupName) => {
    // Find the request across all groups
    let request = null;
    let groupIndex = -1;

    for (let i = 0; i < adminGroups.length; i++) {
      const foundRequest = adminGroups[i].requests.find(req => req.id === requestId);
      if (foundRequest) {
        request = foundRequest;
        groupIndex = i;
        break;
      }
    }

    if (!request) {
      console.error('Request not found:', requestId);
      return;
    }

    setProcessingRequestId(requestId);
    setRequestsError(null);
    setSuccessMessage(null);

    try {
      const result = await ApiService.approveGroupRequest(request.groupId, request.userId);

      if (result.success) {
        // Remove the request from the group's requests list
        setAdminGroups(prevGroups => {
          const newGroups = [...prevGroups];
          newGroups[groupIndex] = {
            ...newGroups[groupIndex],
            requests: newGroups[groupIndex].requests.filter(req => req.id !== requestId)
          };
          // Remove the group if it has no more requests
          return newGroups.filter(group => group.requests.length > 0);
        });
        
        setSuccessMessage(`✅ ${request.userName} has been approved to join ${groupName}`);
      } else {
        setRequestsError(result.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setRequestsError('An error occurred while approving the request');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = async (requestId, groupName) => {
    // Find the request across all groups
    let request = null;
    let groupIndex = -1;

    for (let i = 0; i < adminGroups.length; i++) {
      const foundRequest = adminGroups[i].requests.find(req => req.id === requestId);
      if (foundRequest) {
        request = foundRequest;
        groupIndex = i;
        break;
      }
    }

    if (!request) {
      console.error('Request not found:', requestId);
      return;
    }

    setProcessingRequestId(requestId);
    setRequestsError(null);
    setSuccessMessage(null);

    try {
      const result = await ApiService.rejectGroupRequest(request.groupId, request.userId);

      if (result.success) {
        // Remove the request from the group's requests list
        setAdminGroups(prevGroups => {
          const newGroups = [...prevGroups];
          newGroups[groupIndex] = {
            ...newGroups[groupIndex],
            requests: newGroups[groupIndex].requests.filter(req => req.id !== requestId)
          };
          // Remove the group if it has no more requests
          return newGroups.filter(group => group.requests.length > 0);
        });
        
        setSuccessMessage(`❌ ${request.userName}'s request to join ${groupName} has been rejected`);
      } else {
        setRequestsError(result.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setRequestsError('An error occurred while rejecting the request');
    } finally {
      setProcessingRequestId(null);
    }
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

  // Start editing a post
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  // Handle post updated (callback from NewPost component)
  const handlePostUpdated = (updatedPost) => {
    // Update the post in the local state
    setMyPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id || post._id === updatedPost.id 
          ? { ...post, content: updatedPost.content, image: updatedPost.image } 
          : post
      )
    );
    setSuccessMessage('✅ Post updated successfully!');
    setEditingPost(null);
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    // Confirm before deleting
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    
    if (!confirmed) return;

    setIsDeletingPostId(postId);
    setPostsError(null);

    try {
      const result = await ApiService.deletePost(postId);

      if (result.success) {
        // Remove the post from local state
        setMyPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        setSuccessMessage('✅ Post deleted successfully!');
      } else {
        setPostsError(result.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setPostsError('An error occurred while deleting the post');
    } finally {
      setIsDeletingPostId(null);
    }
  };

  return (
    <div className="myprofile-page">
      <Header 
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        user={user}
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

          {/* Messages Section */}
          {(successMessage || requestsError) && (
            <div className={`message-banner ${successMessage ? 'success' : 'error'}`}>
              <span>{successMessage || requestsError}</span>
              <button 
                className="close-message"
                onClick={() => {
                  setSuccessMessage(null);
                  setRequestsError(null);
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Join Requests Section */}
            <div className="requests-section">
              <h2 className="section-title">📋 Group Join Requests</h2>
              <p className="section-subtitle">Requests from users who want to join groups you admin</p>
              
            {isLoadingRequests ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading requests...</p>
              </div>
            ) : adminGroups.length > 0 ? (
              <div className="groups-container">
                {adminGroups.map(group => (
                  <div key={group.groupId} className="group-section">
                    <div className="group-header">
                      <h3 className="group-name">👥 {group.groupName}</h3>
                      <span className="requests-count">
                        {group.requests.length} {group.requests.length === 1 ? 'Request' : 'Requests'}
                      </span>
                    </div>
              <div className="requests-list">
                      {group.requests.map(request => (
                  <div key={request.id} className="request-card">
                    <img 
                      src={request.userAvatar} 
                      alt={request.userName} 
                      className="request-avatar"
                    />
                    <div className="request-info">
                      <h3 className="request-username">{request.userName}</h3>
                      <p className="request-details">
                              wants to join this group
                      </p>
                      <span className="request-time">{request.requestDate}</span>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="btn-approve"
                              onClick={() => handleApprove(request.id, group.groupName)}
                              disabled={processingRequestId === request.id}
                      >
                              {processingRequestId === request.id ? '⌛' : '✓'} Approve
                      </button>
                      <button 
                        className="btn-reject"
                              onClick={() => handleReject(request.id, group.groupName)}
                              disabled={processingRequestId === request.id}
                      >
                              {processingRequestId === request.id ? '⌛' : '✕'} Reject
                      </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-requests">
                <p>🎉 No pending requests at the moment</p>
            </div>
          )}
          </div>

          {/* My Posts Section */}
          <div className="posts-section">
            <h2 className="section-title">📝 My Posts</h2>
            <p className="section-subtitle">All posts you've shared</p>
            
            {/* Loading State for Posts */}
            {isLoadingPosts && (
              <div className="loading-message">
                <p>Loading your posts...</p>
              </div>
            )}

            {/* Error State for Posts */}
            {postsError && !isLoadingPosts && (
              <div className="error-message">
                <p>{postsError}</p>
                <button onClick={fetchUserPosts} className="retry-btn">Try Again</button>
              </div>
            )}

            {/* Posts List */}
            {!isLoadingPosts && !postsError && (
              <div className="posts-list">
                {myPosts.length > 0 ? (
                  myPosts.map(post => {
                    const isEditing = editingPost && editingPost._id === post._id;
                    const isDeleting = isDeletingPostId === post._id;

                    return (
                      <div key={post._id} className="my-post-card">
                        {isEditing ? (
                          // Edit Mode - Use NewPost Component
                          <NewPost
                            user={user}
                            editMode={true}
                            postToEdit={post}
                            onPostUpdated={handlePostUpdated}
                            onCancelEdit={handleCancelEdit}
                          />
                        ) : (
                          // View Mode
                          <>
                            <div className="post-card-header">
                              <img
                                src={getAvatar(post.userId?.avatar, post.userId?.name)}
                                alt={post.userId?.name || user?.name}
                                className="post-avatar"
                              />
                              <div className="post-user-info">
                                <h3 className="post-username">{post.userId?.name || user?.name}</h3>
                                <p className="post-time">{new Date(post.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="post-actions-menu">
                                <button
                                  className="btn-edit-post"
                                  onClick={() => handleEditPost(post)}
                                  title="Edit post"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn-delete-post"
                                  onClick={() => handleDeletePost(post._id)}
                                  disabled={isDeleting}
                                  title="Delete post"
                                >
                                  {isDeleting ? '⌛' : '🗑️'}
                                </button>
                              </div>
                            </div>
                            <div className="post-card-content">
                              <p className="post-text">{post.content}</p>
                              {post.image && (
                                <img src={post.image} alt="Post" className="post-image" />
                              )}
                            </div>
                            <div className="post-card-footer">
                              <div className="post-stat">
                                <span>💬 {post.commentsCount || 0} Comments</span>
                              </div>
                              <div className="post-stat">
                                <span>❤️ {post.likesCount || 0} Likes</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="no-posts">
                    <p>You haven't posted anything yet.</p>
                    <button className="btn-create-post" onClick={() => onNavigate('feed')}>Create your first post</button>
                  </div>
                )}
              </div>
            )}
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

