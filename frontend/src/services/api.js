/**
 * Main API Service
 * This file exports a unified ApiService class that combines all API modules
 * Maintains backward compatibility with the existing codebase
 */

import AuthApi from './auth/authApi';
import PostsApi from './posts/postsApi';
import GroupsApi from './groups/groupsApi';
import SearchApi from './search/searchApi';
import AiApi from './ai/aiApi';
import StatisticsApi from './statistics/statisticsApi';
import ChatApi from './chat/chatApi';

/**
 * Unified API Service
 * Provides a single interface for all API operations
 */
class ApiService {
  // ===========================
  // Authentication API
  // ===========================
  static login = AuthApi.login.bind(AuthApi);
  static register = AuthApi.register.bind(AuthApi);
  static verifyToken = AuthApi.verifyToken.bind(AuthApi);
  static logout = AuthApi.logout.bind(AuthApi);
  static updateAvatar = AuthApi.updateAvatar.bind(AuthApi);
  static updateUserPreferences = AuthApi.updateUserPreferences.bind(AuthApi);

  // ===========================
  // Posts API
  // ===========================
  static getPosts = PostsApi.getPosts.bind(PostsApi);
  static createPost = PostsApi.createPost.bind(PostsApi);
  static getUserPosts = PostsApi.getUserPosts.bind(PostsApi);
  static getGroupPosts = PostsApi.getGroupPosts.bind(PostsApi);
  static updatePost = PostsApi.updatePost.bind(PostsApi);
  static deletePost = PostsApi.deletePost.bind(PostsApi);
  static likePost = PostsApi.likePost.bind(PostsApi);
  static addComment = PostsApi.addComment.bind(PostsApi);
  static getComments = PostsApi.getComments.bind(PostsApi);

  // ===========================
  // Groups API
  // ===========================
  static createGroup = GroupsApi.createGroup.bind(GroupsApi);
  static getMyGroups = GroupsApi.getMyGroups.bind(GroupsApi);
  static getSuggestedGroups = GroupsApi.getSuggestedGroups.bind(GroupsApi);
  static joinGroup = GroupsApi.joinGroup.bind(GroupsApi);
  static leaveGroup = GroupsApi.leaveGroup.bind(GroupsApi);
  static getAdminGroupsWithRequests = GroupsApi.getAdminGroupsWithRequests.bind(GroupsApi);
  static approveGroupRequest = GroupsApi.approveGroupRequest.bind(GroupsApi);
  static rejectGroupRequest = GroupsApi.rejectGroupRequest.bind(GroupsApi);
  static updateGroup = GroupsApi.updateGroup.bind(GroupsApi);
  static deleteGroup = GroupsApi.deleteGroup.bind(GroupsApi);
  static removeUserFromGroup = GroupsApi.removeUserFromGroup.bind(GroupsApi);
  static getGroupMembers = GroupsApi.getGroupMembers.bind(GroupsApi);

  // ===========================
  // Search API
  // ===========================
  static searchPosts = SearchApi.searchPosts.bind(SearchApi);
  static searchGroups = SearchApi.searchGroups.bind(SearchApi);

  // ===========================
  // AI API
  // ===========================
  static generatePostWithAI = AiApi.generatePostWithAI.bind(AiApi);

  // ===========================
  // Statistics API
  // ===========================
  static getPostsOverTime = StatisticsApi.getPostsOverTime.bind(StatisticsApi);
  static getPostsPerGroup = StatisticsApi.getPostsPerGroup.bind(StatisticsApi);
  static getPopularGroups = StatisticsApi.getPopularGroups.bind(StatisticsApi);
  static getGeneralStats = StatisticsApi.getGeneralStats.bind(StatisticsApi);

  // ===========================
  // Chat API
  // ===========================
  static getConversations = ChatApi.getConversations.bind(ChatApi);
  static getConversation = ChatApi.getConversation.bind(ChatApi);
  static markAsRead = ChatApi.markAsRead.bind(ChatApi);
  static deleteConversation = ChatApi.deleteConversation.bind(ChatApi);
  static createWebSocketConnection = ChatApi.createWebSocketConnection.bind(ChatApi);
  static getWebSocketUrl = ChatApi.getWebSocketUrl.bind(ChatApi);
}

export default ApiService;

