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
    video: null,
    likes: 24,
    comments: 5,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    group: 'React Developers Israel',
  },
  {
    id: 2,
    userId: 2,
    content: 'Beautiful sunset in Jerusalem today 🌅',
    image: 'https://picsum.photos/600/400?random=1',
    video: null,
    likes: 45,
    comments: 12,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    group: 'Tech Entrepreneurs',
  },
  {
    id: 3,
    userId: 3,
    content: 'Check out this amazing coding tutorial I found! 🎥',
    image: null,
    // HTML5 Video Example - Sample video URL
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 32,
    comments: 15,
    timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    group: 'React Developers Israel',
  },
  {
    id: 4,
    userId: 1,
    content: 'Learning React is so much fun! Anyone want to collaborate on a project?',
    image: null,
    video: null,
    likes: 18,
    comments: 8,
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    group: 'UI/UX Designers',
  },
];

// Mock groups data with tags for matching user interests
export const mockGroups = [
  {
    id: 1,
    name: 'React Developers Israel',
    description: 'Community for React developers in Israel',
    tags: ['React', 'JavaScript', 'Frontend'],
    members: 1240,
    image: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: 2,
    name: 'Tech Entrepreneurs',
    description: 'Network for startup founders and entrepreneurs',
    tags: ['Startup', 'Business', 'Marketing'],
    members: 856,
    image: 'https://picsum.photos/400/300?random=11'
  },
  {
    id: 3,
    name: 'UI/UX Designers',
    description: 'Share and discuss design trends',
    tags: ['UI/UX Design', 'Creative', 'Design'],
    members: 642,
    image: 'https://picsum.photos/400/300?random=12'
  },
  {
    id: 4,
    name: 'JavaScript Masters',
    description: 'Advanced JavaScript techniques and best practices',
    tags: ['JavaScript', 'Development', 'Frontend'],
    members: 980,
    image: 'https://picsum.photos/400/300?random=13'
  },
  {
    id: 5,
    name: 'Mobile Developers Hub',
    description: 'iOS, Android, and React Native developers',
    tags: ['Mobile Development', 'React', 'Development'],
    members: 1520,
    image: 'https://picsum.photos/400/300?random=14'
  },
  {
    id: 6,
    name: 'Backend Engineers',
    description: 'Server-side development and APIs',
    tags: ['Backend', 'Development', 'APIs'],
    members: 1100,
    image: 'https://picsum.photos/400/300?random=15'
  },
  {
    id: 7,
    name: 'DevOps Community',
    description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure',
    tags: ['DevOps', 'Cloud Computing', 'Infrastructure'],
    members: 890,
    image: 'https://picsum.photos/400/300?random=16'
  },
  {
    id: 8,
    name: 'Data Science & ML',
    description: 'Machine Learning, AI, and Data Analytics',
    tags: ['Data Science', 'Machine Learning', 'AI'],
    members: 1350,
    image: 'https://picsum.photos/400/300?random=17'
  },
  {
    id: 9,
    name: 'Cybersecurity Experts',
    description: 'Security, penetration testing, and ethical hacking',
    tags: ['Cybersecurity', 'Security', 'Technology'],
    members: 750,
    image: 'https://picsum.photos/400/300?random=18'
  },
  {
    id: 10,
    name: 'Creative Photographers',
    description: 'Share your photography skills and learn new techniques',
    tags: ['Photography', 'Creative', 'Art'],
    members: 620,
    image: 'https://picsum.photos/400/300?random=19'
  },
];

