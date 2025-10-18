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

  // ===== Group Management APIs =====

  // Create a new group
  static async createGroup(groupData) {
    console.log('🔧 ApiService.createGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/create`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Group Data:', groupData);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to create group');
        throw new Error(data.message || 'Failed to create group');
      }

      console.log('✅ Create group API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Group created successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Group created successfully'
      };
    } catch (error) {
      console.log('❌ Create group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create group'
      };
    }
  }

  // Get all groups user belongs to
  static async getMyGroups() {
    console.log('🔧 ApiService.getMyGroups() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/my`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch my groups');
        throw new Error(data.message || 'Failed to fetch my groups');
      }

      console.log('✅ Get my groups API call successful');
      
      return {
        success: true,
        data: data.groups || data.data || [],
        message: data.message || 'Groups fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get my groups API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch my groups'
      };
    }
  }

  // Get suggested groups
  static async getSuggestedGroups() {
    console.log('🔧 ApiService.getSuggestedGroups() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/suggested`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/suggested`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch suggested groups');
        throw new Error(data.message || 'Failed to fetch suggested groups');
      }

      console.log('✅ Get suggested groups API call successful');
      
      return {
        success: true,
        data: data.groups || data.data || [],
        message: data.message || 'Suggested groups fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get suggested groups API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch suggested groups'
      };
    }
  }

  // Join a group
  static async joinGroup(groupId) {
    console.log('🔧 ApiService.joinGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/join`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Group ID:', groupId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to join group');
        throw new Error(data.message || 'Failed to join group');
      }

      console.log('✅ Join group API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Joined group successfully'
      };
    } catch (error) {
      console.log('❌ Join group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to join group'
      };
    }
  }

  // Leave a group
  static async leaveGroup(groupId) {
    console.log('🔧 ApiService.leaveGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/leave`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Group ID:', groupId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to leave group');
        throw new Error(data.message || 'Failed to leave group');
      }

      console.log('✅ Leave group API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Left group successfully'
      };
    } catch (error) {
      console.log('❌ Leave group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to leave group'
      };
    }
  }

  // Get all groups where user is admin with pending join requests
  static async getAdminGroupsWithRequests() {
    console.log('🔧 ApiService.getAdminGroupsWithRequests() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/admin/requests`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/admin/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch group requests');
        throw new Error(data.message || 'Failed to fetch group requests');
      }

      console.log('✅ Get admin groups with requests API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Requests fetched successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Requests fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get admin groups with requests API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch group requests'
      };
    }
  }

  // Approve a join request
  static async approveGroupRequest(groupId, userId) {
    console.log('🔧 ApiService.approveGroupRequest() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/requests/${userId}/approve`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Group ID:', groupId);
      console.log('📤 User ID:', userId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/requests/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to approve request');
        throw new Error(data.message || 'Failed to approve request');
      }

      console.log('✅ Approve request API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Request approved successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Request approved successfully'
      };
    } catch (error) {
      console.log('❌ Approve request API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to approve request'
      };
    }
  }

  // Reject a join request
  static async rejectGroupRequest(groupId, userId) {
    console.log('🔧 ApiService.rejectGroupRequest() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/requests/${userId}/reject`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Group ID:', groupId);
      console.log('📤 User ID:', userId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/requests/${userId}/reject`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to reject request');
        throw new Error(data.message || 'Failed to reject request');
      }

      console.log('✅ Reject request API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Request rejected successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Request rejected successfully'
      };
    } catch (error) {
      console.log('❌ Reject request API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to reject request'
      };
    }
  }
}

export default ApiService;
