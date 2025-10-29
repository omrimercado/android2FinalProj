import { Post } from '../models/Post.js';
import { Group } from '../models/Group.js';

export const searchPosts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, author, sort = 'date' } = req.query;
    const userId = req.user._id;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
        error: 'Please provide a search term',
      });
    }

    const searchTerm = q.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const maxLimit = Math.min(parseInt(limit), 50);

    const userGroups = await Group.find({ members: userId }).select('_id');
    const groupIds = userGroups.map((group) => group._id);

    const searchQuery = {
      content: { $regex: searchTerm, $options: 'i' },
      $or: [{ groupId: null }, { groupId: { $in: groupIds } }],
    };

    if (author) {
      searchQuery.userId = author;
    }

    const totalResults = await Post.countDocuments(searchQuery);

    const sortOptions = {};
    if (sort === 'date') {
      sortOptions.createdAt = -1;
    } else if (sort === 'likes') {
      sortOptions.likesCount = -1;
    }

    const posts = await Post.find(searchQuery)
      .populate('userId', 'name email avatar')
      .populate('groupId', 'name')
      .populate('comments.userId', 'name email avatar')
      .skip(skip)
      .limit(maxLimit)
      .sort(sortOptions)
      .lean();

    const totalPages = Math.ceil(totalResults / maxLimit);

    res.status(200).json({
      success: true,
      message: 'Post search results retrieved successfully',
      data: {
        results: posts,
        count: posts.length,
        totalResults,
        page: parseInt(page),
        totalPages,
        hasMore: parseInt(page) < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchGroups = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, tags } = req.query;
    const userId = req.user._id;

    // At least one search criterion is required (q or tags)
    if ((!q || q.trim().length === 0) && !tags) {
      return res.status(400).json({
        success: false,
        message: 'Search query or tags are required',
        error: 'Please provide a search term or select a category',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const maxLimit = Math.min(parseInt(limit), 50);

    // Build search query
    const searchConditions = [];
    
    // Add text search if q is provided
    if (q && q.trim().length > 0) {
      const searchTerm = q.trim();
      searchConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
      });
    }
    
    // Add tags filter if provided
    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim());
      searchConditions.push({
        tags: { $in: tagArray },
      });
    }

    const searchQuery = {
      $and: [
        ...searchConditions,
        {
          $or: [
            { isPrivate: false },
            { members: userId },
          ],
        },
      ],
    };

    const totalResults = await Group.countDocuments(searchQuery);

    const groups = await Group.find(searchQuery)
      .populate('adminId', 'name email avatar')
      .select('name description tags adminId members membersCount isPrivate createdAt')
      .skip(skip)
      .limit(maxLimit)
      .sort({ membersCount: -1, createdAt: -1 })
      .lean();

    const groupsWithStatus = groups.map((group) => ({
      ...group,
      isMember: group.members.some(
        (memberId) => memberId.toString() === userId.toString()
      ),
      isAdmin: group.adminId._id.toString() === userId.toString(),
    }));

    const totalPages = Math.ceil(totalResults / maxLimit);

    res.status(200).json({
      success: true,
      message: 'Group search results retrieved successfully',
      data: {
        results: groupsWithStatus,
        count: groupsWithStatus.length,
        totalResults,
        page: parseInt(page),
        totalPages,
        hasMore: parseInt(page) < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};