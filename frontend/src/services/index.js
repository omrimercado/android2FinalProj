// Central export point for all API services
import ApiService from './api';
import ChatApiService from './chat/chatApi';

// Export both services
export { ApiService, ChatApiService };

// Default export - the main ApiService for backward compatibility
export default ApiService;

