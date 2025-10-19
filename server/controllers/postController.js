import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;
    const userId = req.user._id;

    const post = await Post.create({
      userId,
      content,
      image: image || null,
    });

    await post.populate('userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name email avatar')
      .populate('comments.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'The specified user does not exist',
      });
    }

    const posts = await Post.find({ userId })
      .populate('userId', 'name email avatar')
      .populate('comments.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        error: 'The specified post does not exist',
      });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike: Remove user from likes array
      post.likes.splice(likeIndex, 1);
    } else {
      // Like: Add user to likes array
      post.likes.push(userId);
    }

    await post.save();

    // Populate user info
    await post.populate('userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      data: {
        post,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comment
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        error: 'The specified post does not exist',
      });
    }

    // Add comment to post
    post.comments.push({
      userId,
      content,
    });

    await post.save();

    // Populate user info
    await post.populate('userId', 'name email avatar');
    await post.populate('comments.userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        post,
        comment: post.comments[post.comments.length - 1],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      'comments.userId',
      'name email avatar'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        error: 'The specified post does not exist',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments: post.comments,
        count: post.comments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
