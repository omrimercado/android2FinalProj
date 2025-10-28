import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Group } from '../models/Group.js';

export const createPost = async (req, res, next) => {
  try {
    const { content, image, video, groupId } = req.body;
    const userId = req.user._id;

    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found',
          error: 'The specified group does not exist',
        });
      }

      if (!group.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'You must be a member of this group to post in it',
        });
      }
    }

    let mediaType = null;
    if (image) mediaType = 'image';
    if (video) mediaType = 'video';

    const post = await Post.create({
      userId,
      content,
      image: image || null,
      video: video || null,
      mediaType,
      groupId: groupId || null,
    });

    await post.populate('userId', 'name email avatar');
    if (post.groupId) {
      await post.populate('groupId', 'name');
    }

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
    const userId = req.user._id;

    const userGroups = await Group.find({ members: userId }).select('_id');
    const groupIds = userGroups.map(group => group._id);

    const posts = await Post.find({
      $or: [
        { groupId: null },
        { groupId: { $in: groupIds } }
      ]
    })
      .populate('userId', 'name email avatar')
      .populate('groupId', 'name')
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
      .populate('groupId', 'name')
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
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();

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

    post.comments.push({
      userId,
      content,
    });

    await post.save();

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

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, image, video } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        error: 'The specified post does not exist',
      });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'You are not authorized to update this post',
      });
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (image !== undefined) {
      post.image = image;
      post.video = null;
      post.mediaType = image ? 'image' : null;
    }
    if (video !== undefined) {
      post.video = video;
      post.image = null;
      post.mediaType = video ? 'video' : null;
    }

    await post.save();

    await post.populate('userId', 'name email avatar');
    await post.populate('comments.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
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

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'You are not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: {
        postId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupPosts = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You must be a member of this group to view its posts',
      });
    }

    const posts = await Post.find({ groupId })
      .populate('userId', 'name email avatar')
      .populate('groupId', 'name')
      .populate('comments.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Group posts retrieved successfully',
      data: {
        posts,
        count: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
