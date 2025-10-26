import { API_BASE_URL } from '../config';

/**
 * Posts API Service
 * Handles all post-related operations (CRUD, likes, comments)
 */
class PostsApi {
  // Get all posts
  static async getPosts() {
    console.log('🔧 PostsApi.getPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Posts fetched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch posts'
      };
    }
  }

  // Create a new post
  static async createPost(postData) {
    console.log('🔧 PostsApi.createPost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Post Data:', postData);

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post created successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create post'
      };
    }
  }

  // Get posts by a specific user
  static async getUserPosts(userId) {
    console.log('🔧 PostsApi.getUserPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/user/${userId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user posts');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'User posts fetched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user posts'
      };
    }
  }

  // Get posts for a specific group
  static async getGroupPosts(groupId) {
    console.log('🔧 PostsApi.getGroupPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/group/${groupId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/group/${groupId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch group posts');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Group posts fetched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch group posts'
      };
    }
  }

  // Update a post
  static async updatePost(postId, postData) {
    console.log('🔧 PostsApi.updatePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post updated successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update post'
      };
    }
  }

  // Delete a post
  static async deletePost(postId) {
    console.log('🔧 PostsApi.deletePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post deleted successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete post'
      };
    }
  }

  // Like or unlike a post (toggle)
  static async likePost(postId) {
    console.log('🔧 PostsApi.likePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/like`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to like post');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post liked/unliked successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to like post'
      };
    }
  }

  // Add a comment to a post
  static async addComment(postId, content) {
    console.log('🔧 PostsApi.addComment() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/comment`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Comment added successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to add comment'
      };
    }
  }

  // Get all comments for a post
  static async getComments(postId) {
    console.log('🔧 PostsApi.getComments() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/comments`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch comments');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Comments fetched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch comments'
      };
    }
  }
}

export default PostsApi;

