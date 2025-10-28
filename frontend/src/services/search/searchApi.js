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

      // Build query string - translate frontend params to backend params
      const params = new URLSearchParams();

      // Translate 'query' to 'q' (backend expects 'q')
      if (searchParams.query) {
        params.append('q', searchParams.query);
      }

      // Handle groupFilter - backend filters by user's groups automatically
      // If specific group is selected, we can add it as author filter (not implemented yet on backend)
      // For now, backend automatically filters posts by user's group membership

      // Translate 'sortBy' to 'sort' (backend expects 'sort')
      if (searchParams.sortBy) {
        let sortValue = 'date'; // default
        if (searchParams.sortBy === 'newest') {
          sortValue = 'date';
        } else if (searchParams.sortBy === 'most_liked') {
          sortValue = 'likes';
        }
        // Note: 'most_commented' not yet supported by backend
        params.append('sort', sortValue);
      }

      // Add pagination params
      params.append('page', searchParams.page || 1);
      params.append('limit', searchParams.limit || 20);

      const endpoint = `${API_BASE_URL}/search/posts?${params.toString()}`;

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Search Params:', searchParams);
      console.log('📤 Translated Params:', params.toString());

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

      // Backend returns data.data.results, handle both formats
      const posts = data.data?.results || data.data || data.posts || [];

      return {
        success: true,
        data: posts,
        count: data.data?.count || posts.length,
        totalResults: data.data?.totalResults || posts.length,
        page: data.data?.page || 1,
        totalPages: data.data?.totalPages || 1,
        hasMore: data.data?.hasMore || false,
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
   * @param {string} searchParams.category - Category filter (treated as tag)
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

      // Build query string - translate frontend params to backend params
      const params = new URLSearchParams();

      // Translate 'name' to 'q' (backend expects 'q' for search term)
      if (searchParams.name) {
        params.append('q', searchParams.name);
      }

      // Translate 'category' to 'tags' (backend uses tags for filtering)
      if (searchParams.category) {
        params.append('tags', searchParams.category);
      }

      // Note: 'size' filter not implemented on backend yet
      // Backend filters groups automatically by:
      // - Public groups
      // - Private groups where user is a member

      // Add pagination params
      params.append('page', searchParams.page || 1);
      params.append('limit', searchParams.limit || 20);

      const endpoint = `${API_BASE_URL}/search/groups?${params.toString()}`;

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Search Params:', searchParams);
      console.log('📤 Translated Params:', params.toString());

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

      // Backend returns data.data.results, handle both formats
      const groups = data.data?.results || data.data || data.groups || [];

      return {
        success: true,
        data: groups,
        count: data.data?.count || groups.length,
        totalResults: data.data?.totalResults || groups.length,
        page: data.data?.page || 1,
        totalPages: data.data?.totalPages || 1,
        hasMore: data.data?.hasMore || false,
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

