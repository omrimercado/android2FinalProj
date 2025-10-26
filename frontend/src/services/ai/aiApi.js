import { API_BASE_URL } from '../config';

/**
 * AI API Service
 * Handles AI-powered post generation using LangGraph
 */
class AiApi {
  /**
   * Generate post content using AI with LangGraph
   * @param {Object} params - Generation parameters
   * @param {string} params.topic - Topic for the post
   * @param {string} params.style - Style of the post (professional, casual, funny, inspirational, storytelling)
   * @param {string} params.length - Length of the post (short, medium, long)
   */
  static async generatePostWithAI({ topic, style = 'casual', length = 'medium' }) {
    console.log('🔧 AiApi.generatePostWithAI() - התחלה');
    console.log('📍 Endpoint:', `${API_BASE_URL}/ai/generate-post`);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      console.log('📤 Request Method:', 'POST');
      console.log('📤 Topic:', topic);
      console.log('📤 Style:', style);
      console.log('📤 Length:', length);

      const response = await fetch(`${API_BASE_URL}/ai/generate-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, style, length })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate AI post');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'AI post generated successfully'
      };
    } catch (error) {
      console.error('🔴 Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate AI post'
      };
    }
  }
}

export default AiApi;

