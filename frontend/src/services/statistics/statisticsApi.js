import { API_BASE_URL } from '../config';

/**
 * Statistics API Service
 * Handles all statistics and analytics operations
 */
class StatisticsApi {
  // Get posts over time statistics
  static async getPostsOverTime() {
    console.log('StatisticsApi.getPostsOverTime() - start');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/statistics/posts-over-time`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts over time data');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Data fetched successfully'
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch posts over time data'
      };
    }
  }

  // Get posts per group statistics
  static async getPostsPerGroup() {
    console.log('StatisticsApi.getPostsPerGroup() - start');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/statistics/posts-per-group`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts per group data');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Data fetched successfully'
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch posts per group data'
      };
    }
  }

  // Get popular groups statistics
  static async getPopularGroups() {
    console.log('StatisticsApi.getPopularGroups() - start');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/statistics/popular-groups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch popular groups data');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Data fetched successfully'
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch popular groups data'
      };
    }
  }

  // Get general statistics
  static async getGeneralStats() {
    console.log('StatisticsApi.getGeneralStats() - start');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/statistics/general`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch general statistics');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Data fetched successfully'
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch general statistics'
      };
    }
  }
}

export default StatisticsApi;

