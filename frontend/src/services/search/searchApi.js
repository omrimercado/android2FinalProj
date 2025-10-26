import { API_BASE_URL } from '../config';

/**
 * Search API Service
 * Handles advanced search for posts and groups
 */
class SearchApi {
  /**
   * Search posts with advanced filters
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search text/keywords
   * @param {string} searchParams.groupFilter - 'all_my_groups' or specific groupId
   * @param {string} searchParams.dateRange - 'today', 'week', 'month', 'all'
   * @param {string} searchParams.sortBy - 'newest', 'most_liked', 'most_commented'
   */
  static async searchPosts(searchParams) {
    console.log('🔧 SearchApi.searchPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/search/posts`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      // Build query string
      const params = new URLSearchParams();
      if (searchParams.query) params.append('query', searchParams.query);
      if (searchParams.groupFilter) params.append('groupFilter', searchParams.groupFilter);
      if (searchParams.dateRange) params.append('dateRange', searchParams.dateRange);
      if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);

      const endpoint = `${API_BASE_URL}/search/posts?${params.toString()}`;

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Search Params:', searchParams);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search posts');
      }

      return {
        success: true,
        data: data.data || data.posts || [],
        message: data.message || 'Posts searched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to search posts'
      };
    }
  }

  /**
   * Search groups with advanced filters
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.name - Group name search
   * @param {string} searchParams.category - Category filter
   * @param {string} searchParams.size - Group size filter ('small', 'medium', 'large', 'huge')
   */
  static async searchGroups(searchParams) {
    console.log('🔧 SearchApi.searchGroups() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/search/groups`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      // Build query string
      const params = new URLSearchParams();
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.category) params.append('category', searchParams.category);
      if (searchParams.size) params.append('size', searchParams.size);

      const endpoint = `${API_BASE_URL}/search/groups?${params.toString()}`;

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Search Params:', searchParams);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search groups');
      }

      return {
        success: true,
        data: data.data || data.groups || [],
        message: data.message || 'Groups searched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to search groups'
      };
    }
  }
}

export default SearchApi;

