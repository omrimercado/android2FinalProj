// Default avatar image for users without profile pictures
export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=200&bold=true';

// Get user avatar or return default
export const getAvatar = (avatar, userName = 'User') => {
  if (!avatar || avatar === '' || avatar === '👤') {
    // Generate avatar with user's name
    const name = userName ? encodeURIComponent(userName) : 'User';
    return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&size=200&bold=true`;
  }
  return avatar;
};

// Format date/time
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

