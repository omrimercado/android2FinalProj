// Mock Users for development (until server is ready)
export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Software Developer | Tech Enthusiast',
    location: 'Tel Aviv, Israel'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Product Designer | Creative Mind',
    location: 'Jerusalem, Israel'
  },
  {
    id: 3,
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Testing Account',
    location: 'Haifa, Israel'
  }
];

// Mock authentication function
export const authenticateUser = (email, password) => {
  const user = mockUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, message: 'Invalid email or password' };
};

// Mock posts data
export const mockPosts = [
  {
    id: 1,
    userId: 1,
    content: 'Just launched my new project! Check it out 🚀',
    image: null,
    likes: 24,
    comments: 5,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    userId: 2,
    content: 'Beautiful sunset in Jerusalem today 🌅',
    image: 'https://picsum.photos/600/400?random=1',
    likes: 45,
    comments: 12,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    userId: 3,
    content: 'Learning React is so much fun! Anyone want to collaborate on a project?',
    image: null,
    likes: 18,
    comments: 8,
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
];

// Mock groups data
export const mockGroups = [
  {
    id: 1,
    name: 'React Developers Israel',
    description: 'Community for React developers in Israel',
    members: 1240,
    image: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: 2,
    name: 'Tech Entrepreneurs',
    description: 'Network for startup founders and entrepreneurs',
    members: 856,
    image: 'https://picsum.photos/400/300?random=11'
  },
  {
    id: 3,
    name: 'UI/UX Designers',
    description: 'Share and discuss design trends',
    members: 642,
    image: 'https://picsum.photos/400/300?random=12'
  },
];

