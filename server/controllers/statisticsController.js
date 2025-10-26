import { Post } from '../models/Post.js';
import { Group } from '../models/Group.js';
import { User } from '../models/User.js';

// Get posts count over time (monthly for last 6 months)
export const getPostsOverTime = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const posts = await Post.find({
      createdAt: { $gte: sixMonthsAgo }
    }).select('createdAt');

    // Group posts by month
    const postsByMonth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      postsByMonth[key] = 0;
    }

    // Count posts per month
    posts.forEach(post => {
      const date = new Date(post.createdAt);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (postsByMonth[key] !== undefined) {
        postsByMonth[key]++;
      }
    });

    // Convert to array format for charts
    const data = Object.entries(postsByMonth).map(([month, count]) => ({
      month,
      count
    }));

    res.status(200).json({
      success: true,
      message: 'Posts over time data retrieved successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get posts count per group
export const getPostsPerGroup = async (req, res, next) => {
  try {
    const groups = await Group.find().select('name');
    
    const groupsData = await Promise.all(
      groups.map(async (group) => {
        const postsCount = await Post.countDocuments({ groupId: group._id });
        return {
          groupName: group.name,
          groupId: group._id,
          postsCount
        };
      })
    );

    // Filter out groups with 0 posts and sort by count
    const data = groupsData
      .filter(g => g.postsCount > 0)
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 10); // Top 10 groups

    res.status(200).json({
      success: true,
      message: 'Posts per group data retrieved successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get most popular groups by member count
export const getPopularGroups = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .select('name members')
      .sort({ membersCount: -1 })
      .limit(10);

    const data = groups.map(group => ({
      groupName: group.name,
      groupId: group._id,
      membersCount: group.members.length
    }));

    res.status(200).json({
      success: true,
      message: 'Popular groups data retrieved successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get general platform statistics
export const getGeneralStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalGroups = await Group.countDocuments();
    
    // Posts in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Most active group
    const groups = await Group.find().select('name members');
    let mostActiveGroup = null;
    let maxPosts = 0;

    for (const group of groups) {
      const postsCount = await Post.countDocuments({ groupId: group._id });
      if (postsCount > maxPosts) {
        maxPosts = postsCount;
        mostActiveGroup = {
          name: group.name,
          postsCount
        };
      }
    }

    res.status(200).json({
      success: true,
      message: 'General statistics retrieved successfully',
      data: {
        totalUsers,
        totalPosts,
        totalGroups,
        recentPosts,
        mostActiveGroup
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity distribution
export const getUserActivity = async (req, res, next) => {
  try {
    const totalPosts = await Post.countDocuments();
    
    // Get total likes across all posts
    const posts = await Post.find().select('likes comments');
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    const data = [
      { activity: 'Posts', count: totalPosts },
      { activity: 'Likes', count: totalLikes },
      { activity: 'Comments', count: totalComments }
    ];

    res.status(200).json({
      success: true,
      message: 'User activity data retrieved successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

