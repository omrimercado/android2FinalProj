// API Base URL - Change this to your actual backend URL
const API_BASE_URL = 'https://your-backend-api.com/api';

// API Service for authentication
class ApiService {
  // Login API
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        success: true,
        data: data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Login failed'
      };
    }
  }

  // Register API
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return {
        success: true,
        data: data,
        message: 'Registration successful'
      };
    } catch (error) {
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
}

export default ApiService;
