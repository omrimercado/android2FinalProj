import { API_BASE_URL } from '../config';

/**
 * Authentication API Service
 * Handles user authentication, registration, and profile management
 */
class AuthApi {
  // Login API
  static async login(email, password) {
    console.log('AuthApi.login() - start');
    console.log('Endpoint:', `${API_BASE_URL}/auth/login`);
    
    try {
      const requestBody = { email, password };
      console.log('Request Method:', 'POST');
      console.log('Request Headers:', { 'Content-Type': 'application/json' });
      console.log('Request Body:', { email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        console.log('Server returned error:', data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Login successful'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Login successful'
      };
    } catch (error) {
      console.log('Login API call failed');
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Login failed'
      };
    }
  }

  // Register API
  static async register(userData) {
    console.log('AuthApi.register() - start');
    console.log('Endpoint:', `${API_BASE_URL}/auth/register`);
    
    try {
      console.log('Request Method:', 'POST');
      console.log('Request Body:', { ...userData, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        console.log('Server returned error:', data.message || 'Registration failed');
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Register API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Registration successful'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Registration successful'
      };
    } catch (error) {
      console.log('Register API call failed');
      console.error('Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Registration failed'
      };
    }
  }

  // Verify Token API
  static async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token verification failed');
      }

      return {
        success: true,
        data: data,
        message: 'Token verified'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Token verification failed'
      };
    }
  }

  // Logout API
  static async logout(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      return {
        success: true,
        data: data,
        message: 'Logout successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Logout failed'
      };
    }
  }

  // Update Avatar API
  static async updateAvatar(avatarUrl) {
    console.log('AuthApi.updateAvatar() - start');
    console.log(' Endpoint:', `${API_BASE_URL}/auth/update-avatar`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log(' Request Method:', 'PUT');
      console.log(' Avatar URL:', avatarUrl);
      
      const response = await fetch(`${API_BASE_URL}/auth/update-avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl })
      });

      console.log(' Response Status:', response.status);

      const data = await response.json();
      console.log(' Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Update avatar failed');
      }

      console.log(' Update avatar API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Avatar updated successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Avatar updated successfully'
      };
    } catch (error) {
      console.log(' Update avatar API call failed');
      console.error(' Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Update avatar failed'
      };
    }
  }

  // Update user preferences (interests)
  static async updateUserPreferences(interests) {
  console.log('AuthApi.updateUserPreferences() - start');
    console.log('Endpoint:', `${API_BASE_URL}/auth/preferences`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log(' Request Method:', 'PUT');
      console.log(' Interests:', interests);

      const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ interests })
      });

      console.log('Response Status:', response.status);

      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Update preferences failed');
      }

      console.log('Update preferences API call successful');

      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Preferences updated successfully'
        };
      }

      return {
        success: true,
        data: data,
        message: 'Preferences updated successfully'
      };
    } catch (error) {
      console.log(' Update preferences API call failed');
      console.error(' Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Update preferences failed'
      };
    }
  }
}

export default AuthApi;

