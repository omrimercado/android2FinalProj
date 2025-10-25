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

  // Update a group (admin only)
  static async updateGroup(groupId, groupData) {
    console.log('🔧 ApiService.updateGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'PUT');
      console.log('📤 Group ID:', groupId);
      console.log('📤 Group Data:', groupData);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'PUT',
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to update group');
        throw new Error(data.message || 'Failed to update group');
      }

      console.log('✅ Update group API call successful');
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Group updated successfully'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Group updated successfully'
      };
    } catch (error) {
      console.log('❌ Update group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update group'
      };
    }
  }

  // Delete a group (admin only)
  static async deleteGroup(groupId) {
    console.log('🔧 ApiService.deleteGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Group ID:', groupId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to delete group');
        throw new Error(data.message || 'Failed to delete group');
      }

      console.log('✅ Delete group API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Group deleted successfully'
      };
    } catch (error) {
      console.log('❌ Delete group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete group'
      };
    }
  }

  // Remove a user from group (admin only)
  static async removeUserFromGroup(groupId, userId) {
    console.log('🔧 ApiService.removeUserFromGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/members/${userId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Group ID:', groupId);
      console.log('📤 User ID:', userId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to remove user from group');
        throw new Error(data.message || 'Failed to remove user from group');
      }

      console.log('✅ Remove user from group API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'User removed from group successfully'
      };
    } catch (error) {
      console.log('❌ Remove user from group API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to remove user from group'
      };
    }
  }

  // Get group members (admin only)
  static async getGroupMembers(groupId) {
    console.log('🔧 ApiService.getGroupMembers() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/members`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Group ID:', groupId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch group members');
        throw new Error(data.message || 'Failed to fetch group members');
      }

      console.log('✅ Get group members API call successful');
      
      return {
        success: true,
        data: data.data || data.members || [],
        message: data.message || 'Group members fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get group members API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch group members'
      };
    }
  }

  // Update user preferences (interests)
  static async updateUserPreferences(interests) {
    console.log('🔧 ApiService.updateUserPreferences() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/auth/preferences`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'PUT');
      console.log('📤 Interests:', interests);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ interests })
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Update preferences failed');
        throw new Error(data.message || 'Update preferences failed');
      }

      console.log('✅ Update preferences API call successful');

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
      console.log('❌ Update preferences API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Update preferences failed'
      };
    }
  }

  // ===== Posts Management APIs =====

  // Get all posts
  static async getPosts() {
    console.log('🔧 ApiService.getPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch posts');
        throw new Error(data.message || 'Failed to fetch posts');
      }

      console.log('✅ Get posts API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Posts fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get posts API call failed');
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
    console.log('🔧 ApiService.createPost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Post Data:', postData);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to create post');
        throw new Error(data.message || 'Failed to create post');
      }

      console.log('✅ Create post API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post created successfully'
      };
    } catch (error) {
      console.log('❌ Create post API call failed');
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
    console.log('🔧 ApiService.getUserPosts() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/user/${userId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('📤 User ID:', userId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch user posts');
        throw new Error(data.message || 'Failed to fetch user posts');
      }

      console.log('✅ Get user posts API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'User posts fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get user posts API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user posts'
      };
    }
  }

  // Update a post
  static async updatePost(postId, postData) {
    console.log('🔧 ApiService.updatePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'PUT');
      console.log('📤 Post ID:', postId);
      console.log('📤 Post Data:', postData);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to update post');
        throw new Error(data.message || 'Failed to update post');
      }

      console.log('✅ Update post API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post updated successfully'
      };
    } catch (error) {
      console.log('❌ Update post API call failed');
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
    console.log('🔧 ApiService.deletePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Post ID:', postId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to delete post');
        throw new Error(data.message || 'Failed to delete post');
      }

      console.log('✅ Delete post API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post deleted successfully'
      };
    } catch (error) {
      console.log('❌ Delete post API call failed');
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
    console.log('🔧 ApiService.likePost() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/like`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Post ID:', postId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to like post');
        throw new Error(data.message || 'Failed to like post');
      }

      console.log('✅ Like post API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Post liked/unliked successfully'
      };
    } catch (error) {
      console.log('❌ Like post API call failed');
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
    console.log('🔧 ApiService.addComment() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/comment`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Post ID:', postId);
      console.log('📤 Comment:', content);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to add comment');
        throw new Error(data.message || 'Failed to add comment');
      }

      console.log('✅ Add comment API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Comment added successfully'
      };
    } catch (error) {
      console.log('❌ Add comment API call failed');
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
    console.log('🔧 ApiService.getComments() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/${postId}/comments`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('📤 Post ID:', postId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch comments');
        throw new Error(data.message || 'Failed to fetch comments');
      }

      console.log('✅ Get comments API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Comments fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get comments API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch comments'
      };
    }
  }

  // ===== Advanced Search APIs =====

  /**
   * Search posts with advanced filters
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search text/keywords
   * @param {string} searchParams.groupFilter - 'all_my_groups' or specific groupId
   * @param {string} searchParams.dateRange - 'today', 'week', 'month', 'all'
   * @param {string} searchParams.sortBy - 'newest', 'most_liked', 'most_commented'
   */
  static async searchPosts(searchParams) {
    console.log('🔧 ApiService.searchPosts() - התחלה');
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
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(endpoint, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to search posts');
        throw new Error(data.message || 'Failed to search posts');
      }

      console.log('✅ Search posts API call successful');

      return {
        success: true,
        data: data.data || data.posts || [],
        message: data.message || 'Posts searched successfully'
      };
    } catch (error) {
      console.log('❌ Search posts API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to search posts'
      };
    }
  }

  /**
   * Generate post content using AI
   * @param {string} userInput - User's text input for AI to generate post from
   */
  static async generatePostWithAI(userInput) {
    console.log('🔧 ApiService.generatePostWithAI() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/posts/generate-ai`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 User Input:', userInput);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(`${API_BASE_URL}/posts/generate-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userInput })
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        console.log('⚠️ Server returned error:', data.message || 'Failed to generate AI post');
        throw new Error(data.message || 'Failed to generate AI post');
      }

      console.log('✅ Generate AI post API call successful');

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'AI post generated successfully'
      };
    } catch (error) {
      console.log('❌ Generate AI post API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate AI post'
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
    console.log('🔧 ApiService.searchGroups() - התחלה');
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
      console.log('🎫 Token:', token ? 'Found' : 'Not found');

      const response = await fetch(endpoint, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to search groups');
        throw new Error(data.message || 'Failed to search groups');
      }

      console.log('✅ Search groups API call successful');

      return {
        success: true,
        data: data.data || data.groups || [],
        message: data.message || 'Groups searched successfully'
      };
    } catch (error) {
      console.log('❌ Search groups API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to search groups'
      };
    }
  }
}

export default ApiService;