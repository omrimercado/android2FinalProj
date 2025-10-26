import { API_BASE_URL } from '../config';

/**
 * Chat API Service
 * Handles all chat-related operations (conversations, messages, WebSocket)
 */
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000/chat';

class ChatApi {
  // קבלת כל השיחות של המשתמש
  static async getConversations() {
    console.log('🔧 ChatApi.getConversations() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/chat/conversations`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch conversations');
        throw new Error(data.message || 'Failed to fetch conversations');
      }

      console.log('✅ Get conversations API call successful');
      
      return {
        success: true,
        data: data.conversations || data.data || [],
        message: data.message || 'Conversations fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get conversations API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch conversations'
      };
    }
  }

  // קבלת שיחה ספציפית
  static async getConversation(userId, targetUserId) {
    console.log('🔧 ChatApi.getConversation() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/chat/conversation/${userId}/${targetUserId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'GET');
      console.log('📤 User ID:', userId);
      console.log('📤 Target User ID:', targetUserId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/chat/conversation/${userId}/${targetUserId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to fetch conversation');
        throw new Error(data.message || 'Failed to fetch conversation');
      }

      console.log('✅ Get conversation API call successful');
      
      return {
        success: true,
        data: data.messages || data.data || [],
        message: data.message || 'Conversation fetched successfully'
      };
    } catch (error) {
      console.log('❌ Get conversation API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch conversation'
      };
    }
  }

  // סימון הודעות כנקראו
  static async markAsRead(conversationId) {
    console.log('🔧 ChatApi.markAsRead() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/chat/conversation/${conversationId}/read`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'PUT');
      console.log('📤 Conversation ID:', conversationId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}/read`, {
        method: 'PUT',
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to mark as read');
        throw new Error(data.message || 'Failed to mark as read');
      }

      console.log('✅ Mark as read API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Marked as read successfully'
      };
    } catch (error) {
      console.log('❌ Mark as read API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to mark as read'
      };
    }
  }

  // מחיקת שיחה
  static async deleteConversation(conversationId) {
    console.log('🔧 ChatApi.deleteConversation() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/chat/conversation/${conversationId}`);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'DELETE');
      console.log('📤 Conversation ID:', conversationId);
      console.log('🎫 Token:', token ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}`, {
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
        console.log('⚠️ Server returned error:', data.message || 'Failed to delete conversation');
        throw new Error(data.message || 'Failed to delete conversation');
      }

      console.log('✅ Delete conversation API call successful');
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Conversation deleted successfully'
      };
    } catch (error) {
      console.log('❌ Delete conversation API call failed');
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete conversation'
      };
    }
  }

  // יצירת חיבור WebSocket
  static createWebSocketConnection() {
    console.log('🔧 ChatApi.createWebSocketConnection() - התחלה');
    console.log('📍 WebSocket URL:', WS_BASE_URL);
    
    try {
      const ws = new WebSocket(WS_BASE_URL);
      console.log('✅ WebSocket connection created');
      return ws;
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      throw error;
    }
  }

  // קבלת ה-WebSocket URL
  static getWebSocketUrl() {
    return WS_BASE_URL;
  }
}

export default ChatApi;

