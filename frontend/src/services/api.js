// API Base URL - Change this to your actual backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// API Service for authentication
class ApiService {
  // Login API
  static async login(email, password) {
    console.log('🔧 ApiService.login() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/auth/login`);
    
    try {
      const requestBody = { email, password };
      console.log('📤 Request Method:', 'POST');
      console.log('📤 Request Headers:', { 'Content-Type': 'application/json' });
      console.log('📤 Request Body:', { email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }

      console.log('✅ Login API call successful');
      
      // אם השרת כבר מחזיר success: true עם data, נחזיר את זה ישירות
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data, // מחזירים את data.data (שמכיל token ו-user)
          message: data.message || 'Login successful'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Login successful'
      };
    } catch (error) {
      console.log('❌ Login API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Login failed'
      };
    }
  }

  // Register API
  static async register(userData) {
    console.log('🔧 ApiService.register() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/auth/register`);
    
    try {
      console.log('📤 Request Method:', 'POST');
      console.log('📤 Request Headers:', { 'Content-Type': 'application/json' });
      console.log('📤 Request Body:', { ...userData, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Registration failed');
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ Register API call successful');
      
      // אם השרת כבר מחזיר success: true עם data, נחזיר את זה ישירות
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data, // מחזירים את data.data (שמכיל token ו-user)
          message: data.message || 'Registration successful'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Registration successful'
      };
    } catch (error) {
      console.log('❌ Register API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Registration failed'
      };
    }
  }

  // Forgot Password API
  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return {
        success: true,
        data: data,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to send reset email'
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
    console.log('🔧 ApiService.updateAvatar() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/auth/update-avatar`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'PUT');
      console.log('📤 Avatar URL:', avatarUrl);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/auth/update-avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl })
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Update avatar failed');
        throw new Error(data.message || 'Update avatar failed');
      }

      console.log('✅ Update avatar API call successful');
      
      // אם השרת כבר מחזיר success: true עם data, נחזיר את זה ישירות
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
      console.log('❌ Update avatar API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Update avatar failed'
      };
    }
  }
}

export default ApiService;
