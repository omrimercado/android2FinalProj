import { API_BASE_URL } from '../config';

/**
 * Groups API Service
 * Handles all group-related operations (create, join, leave, manage members, requests)
 */
class GroupsApi {
  // Create a new group
  static async createGroup(groupData) {
    console.log('🔧 GroupsApi.createGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/create`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Group Data:', groupData);
      
      const response = await fetch(`${API_BASE_URL}/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create group');
      }
      
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
    console.log('🔧 GroupsApi.getMyGroups() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/my`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch my groups');
      }
      
      return {
        success: true,
        data: data.groups || data.data || [],
        message: data.message || 'Groups fetched successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.getSuggestedGroups() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/suggested`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/suggested`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suggested groups');
      }
      
      return {
        success: true,
        data: data.groups || data.data || [],
        message: data.message || 'Suggested groups fetched successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.joinGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/join`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join group');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Joined group successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.leaveGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/leave`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to leave group');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Left group successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.getAdminGroupsWithRequests() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/admin/requests`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/admin/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch group requests');
      }
      
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
    console.log('🔧 GroupsApi.approveGroupRequest() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/requests/${userId}/approve`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/requests/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve request');
      }
      
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
    console.log('🔧 GroupsApi.rejectGroupRequest() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/requests/${userId}/reject`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/requests/${userId}/reject`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject request');
      }
      
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
    console.log('🔧 GroupsApi.updateGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update group');
      }
      
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
    console.log('🔧 GroupsApi.deleteGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete group');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Group deleted successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.removeUserFromGroup() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/members/${userId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove user from group');
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'User removed from group successfully'
      };
    } catch (error) {
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
    console.log('🔧 GroupsApi.getGroupMembers() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/groups/${groupId}/members`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch group members');
      }
      
      return {
        success: true,
        data: data.data || data.members || [],
        message: data.message || 'Group members fetched successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch group members'
      };
    }
  }
}

export default GroupsApi;

