import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import ChangeImage from '../components/ChangeImage';
import ApiService from '../services/api';
import './MyProfilePage.css';

export default function MyProfilePage({ user, currentPage, onNavigate, onLogout }) {
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || 'https://i.pravatar.cc/150?img=1');
  
  // State for join requests - now organized by groups
  const [adminGroups, setAdminGroups] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);

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

  // Fetch join requests when component mounts
  useEffect(() => {
    fetchJoinRequests();
  }, []);

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
      // ===== TEMPORARY MOCK DATA FOR TESTING =====
      // TODO: Replace with actual API call when backend is ready
      const USE_MOCK_DATA = true; // Set to false to use real API
      
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data simulating server response
        const mockGroups = [
          {
            groupId: 'group1',
            groupName: 'React Developers Israel',
            requests: [
              {
                id: 'group1-user1',
                groupId: 'group1',
                userId: 'user1',
                userName: 'Sarah Cohen',
                userAvatar: 'https://i.pravatar.cc/150?img=10',
                requestDate: '2 hours ago'
              },
              {
                id: 'group1-user2',
                groupId: 'group1',
                userId: 'user2',
                userName: 'David Levi',
                userAvatar: 'https://i.pravatar.cc/150?img=12',
                requestDate: '5 hours ago'
              },
              {
                id: 'group1-user3',
                groupId: 'group1',
                userId: 'user3',
                userName: 'Rachel Ben-David',
                userAvatar: 'https://i.pravatar.cc/150?img=15',
                requestDate: '1 day ago'
              }
            ]
          },
          {
            groupId: 'group2',
            groupName: 'Tech Entrepreneurs',
            requests: [
              {
                id: 'group2-user4',
                groupId: 'group2',
                userId: 'user4',
                userName: 'Michael Goldstein',
                userAvatar: 'https://i.pravatar.cc/150?img=20',
                requestDate: '3 hours ago'
              },
              {
                id: 'group2-user5',
                groupId: 'group2',
                userId: 'user5',
                userName: 'Emma Wilson',
                userAvatar: 'https://i.pravatar.cc/150?img=25',
                requestDate: '8 hours ago'
              }
            ]
          },
          {
            groupId: 'group3',
            groupName: 'UI/UX Designers',
            requests: [
              {
                id: 'group3-user6',
                groupId: 'group3',
                userId: 'user6',
                userName: 'John Smith',
                userAvatar: 'https://i.pravatar.cc/150?img=30',
                requestDate: '30 minutes ago'
              }
            ]
          }
        ];
        
        setAdminGroups(mockGroups);
        setIsLoadingRequests(false);
        return;
      }
      // ===== END MOCK DATA =====

      const result = await ApiService.getAdminGroupsWithRequests();

      if (result.success) {
        // Transform the data from the server format to component format
        // Expected server response: { groups: [{ group_id, group_name, applied_users: [...] }] }
        const groupsWithRequests = [];
        
        if (result.data && result.data.groups) {
          result.data.groups.forEach(group => {
            // Only include groups that have pending requests
            if (group.applied_users && group.applied_users.length > 0) {
              const transformedRequests = group.applied_users.map(appliedUser => ({
                id: `${group.group_id}-${appliedUser.user_id}`, // Unique ID combining group and user
                groupId: group.group_id,
                userId: appliedUser.user_id,
                userName: appliedUser.name || appliedUser.username || 'Anonymous User',
                userAvatar: appliedUser.avatar || 'https://i.pravatar.cc/150?img=1',
                requestDate: appliedUser.request_date || appliedUser.requested_at || 'Recently'
              }));

              groupsWithRequests.push({
                groupId: group.group_id,
                groupName: group.group_name,
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
      // ===== MOCK MODE: Simulate approval =====
      // TODO: Replace with actual API call when backend is ready
      const USE_MOCK_DATA = true; // Set to false to use real API
      
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate successful approval
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
        setProcessingRequestId(null);
        return;
      }
      // ===== END MOCK MODE =====

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
      // ===== MOCK MODE: Simulate rejection =====
      // TODO: Replace with actual API call when backend is ready
      const USE_MOCK_DATA = true; // Set to false to use real API
      
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate successful rejection
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
        setProcessingRequestId(null);
        return;
      }
      // ===== END MOCK MODE =====

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

