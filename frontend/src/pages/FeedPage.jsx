import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import NewPost from '../components/NewPost';
import ChatWindow from '../components/ChatWindow';
import ApiService from '../services/api';
import { getAvatar } from '../utils/helpers';
import './FeedPage.css';

export default function FeedPage({ user, currentPage, onNavigate, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({}); // { postId: { isExpanded: bool, comments: [], newComment: '', isLoading: bool } }

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.getPosts();

      if (response.success) {
        // Backend returns { data: { posts: [...], count: n } }
        const postsData = response.data.posts || response.data || [];
        setPosts(postsData);
      } else {
        setError(response.message || 'Failed to load posts');
      }
    } catch (err) {
      setError('An error occurred while loading posts');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    // אם זה חיפוש מתקדם (אובייקט עם פרמטרים)
    if (typeof searchParams === 'object' && searchParams.query !== undefined) {
      setIsLoading(true);
      try {
        const result = await ApiService.searchPosts(searchParams);
        if (result.success) {
          setPosts(result.data || []);
          setSearchTerm(''); // Clear simple search term
        } else {
          setError(result.message || 'Failed to search posts');
        }
      } catch (error) {
        console.error('Error searching posts:', error);
        setError('An error occurred while searching');
      } finally {
        setIsLoading(false);
      }
    } 
    // אם זה חיפוש רגיל (סתם טקסט)
    else {
      setSearchTerm(searchParams);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the list
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await ApiService.likePost(postId);

      if (response.success) {
        // Update the post in the local state
        setPosts(posts.map(post =>
          post._id === postId ? response.data.post : post
        ));
      } else {
        console.error('Failed to like post:', response.message);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentClick = async (postId) => {
    const currentState = expandedComments[postId];

    // If already expanded, just collapse it
    if (currentState?.isExpanded) {
      setExpandedComments({
        ...expandedComments,
        [postId]: { ...currentState, isExpanded: false }
      });
      return;
    }

    // If not expanded, expand and fetch comments
    setExpandedComments({
      ...expandedComments,
      [postId]: { isExpanded: true, comments: [], newComment: '', isLoading: true }
    });

    // Fetch comments
    try {
      const response = await ApiService.getComments(postId);
      if (response.success) {
        const commentsData = response.data.comments || [];
        setExpandedComments(prev => ({
          ...prev,
          [postId]: { ...prev[postId], comments: commentsData, isLoading: false }
        }));
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setExpandedComments(prev => ({
        ...prev,
        [postId]: { ...prev[postId], isLoading: false }
      }));
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: { ...prev[postId], newComment: value }
    }));
  };

  const handleAddComment = async (postId) => {
    const commentState = expandedComments[postId];
    const commentText = commentState?.newComment?.trim();

    if (!commentText) return;

    try {
      const response = await ApiService.addComment(postId, commentText);

      if (response.success) {
        // Add the new comment to the comments list
        const newComment = response.data.comment;
        setExpandedComments(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            comments: [...prev[postId].comments, newComment],
            newComment: '' // Clear input
          }
        }));

        // Update the post's comment count
        setPosts(posts.map(post =>
          post._id === postId ? response.data.post : post
        ));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const getUserById = (userId) => {
    // First check if it's the current logged-in user
    if (user && user.id === userId) {
      return user;
    }
    // For posts from API, userId is already populated with user data
    return null;
  };

  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    // Backend populates userId with full user object
    const postUser = post.userId;
    return post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           postUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAvatarClick = (postUser) => {
    // Check if postUser exists and is not the current user
    if (postUser && postUser._id !== user.id) {
      setSelectedChatUser({
        id: postUser._id,
        name: postUser.name,
        email: postUser.email,
        avatar: postUser.avatar
      });
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
              showAdvancedSearch={true}
              searchType="posts"
            />
          </div>

          <NewPost
            user={user}
            onPostCreated={handlePostCreated}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="loading-message">
              <p>Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchPosts} className="retry-btn">Try Again</button>
            </div>
          )}

          {/* Posts Section */}
          {!isLoading && !error && (
            <div className="posts-section">
              {filteredPosts.length === 0 ? (
                <div className="no-posts-message">
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  // Backend populates userId with user object
                  const postUser = post.userId;

                  // Skip rendering if user not found
                  if (!postUser) {
                    console.warn(`User not found for post ${post._id}`);
                    return null;
                  }

                  const isLiked = post.likes && post.likes.includes(user.id);

                  return (
                    <div key={post._id} className="post-card">
                      <div className="post-header">
                        <img
                          src={getAvatar(postUser.avatar, postUser.name)}
                          alt={postUser.name}
                          className="post-avatar"
                          onClick={() => handleAvatarClick(postUser)}
                          style={{ cursor: postUser._id !== user.id ? 'pointer' : 'default' }}
                          title={postUser._id !== user.id ? `שלח הודעה ל-${postUser.name}` : ''}
                        />
                        <div className="post-info">
                          <h4 className="post-author">{postUser.name}</h4>
                          <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="post-content">
                        <p>{post.content}</p>
                        {post.image && <img src={post.image} alt="Post" className="post-image" />}
                      </div>
                      <div className="post-actions">
                        <button
                          className={`action-btn ${isLiked ? 'liked' : ''}`}
                          onClick={() => handleLikePost(post._id)}
                        >
                          <span>{isLiked ? '❤️' : '👍'}</span> {post.likesCount || 0}
                        </button>
                        <button
                          className={`action-btn ${expandedComments[post._id]?.isExpanded ? 'active' : ''}`}
                          onClick={() => handleCommentClick(post._id)}
                        >
                          <span>💬</span> {post.commentsCount || 0}
                        </button>
                        <button className="action-btn">
                          <span>🔄</span> Share
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post._id]?.isExpanded && (
                        <div className="comments-section">
                          {expandedComments[post._id]?.isLoading ? (
                            <div className="comments-loading">Loading comments...</div>
                          ) : (
                            <>
                              {/* Comments List */}
                              <div className="comments-list">
                                {expandedComments[post._id]?.comments?.length === 0 ? (
                                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                  expandedComments[post._id]?.comments?.map((comment) => (
                                    <div key={comment._id} className="comment-item">
                                      <img
                                        src={getAvatar(comment.userId?.avatar, comment.userId?.name)}
                                        alt={comment.userId?.name}
                                        className="comment-avatar"
                                      />
                                      <div className="comment-content">
                                        <div className="comment-header">
                                          <span className="comment-author">{comment.userId?.name}</span>
                                          <span className="comment-time">
                                            {new Date(comment.createdAt).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Add Comment Form */}
                              <div className="add-comment-form">
                                <img
                                  src={getAvatar(user.avatar, user.name)}
                                  alt={user.name}
                                  className="comment-avatar"
                                />
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={expandedComments[post._id]?.newComment || ''}
                                  onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                                  className="comment-input"
                                />
                                <button
                                  onClick={() => handleAddComment(post._id)}
                                  disabled={!expandedComments[post._id]?.newComment?.trim()}
                                  className="comment-submit-btn"
                                >
                                  Post
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
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
