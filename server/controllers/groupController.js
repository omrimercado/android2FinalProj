import { Group } from '../models/Group.js';
import { User } from '../models/User.js';

// @desc    Create a new group
// @route   POST /api/groups/create
// @access  Private
export const createGroup = async (req, res, next) => {
  try {
    const { name, description, tags, isPrivate } = req.body;
    const userId = req.user._id;

    // Trim tags and filter out empty ones
    const cleanedTags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    // Create group with admin as first member
    const group = await Group.create({
      name,
      description,
      tags: cleanedTags,
      adminId: userId,
      members: [userId],
      isPrivate: isPrivate || false,
    });

    // Populate admin info
    await group.populate('adminId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups user is a member of
// @route   GET /api/groups/my
// @access  Private
export const getMyGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate('adminId', 'name email avatar')
      .sort({ createdAt: -1 });

    // Add isAdmin flag to each group
    const groupsWithAdminFlag = groups.map((group) => ({
      ...group.toObject(),
      isAdmin: group.adminId._id.toString() === userId.toString(),
    }));

    res.status(200).json({
      success: true,
      message: 'Groups retrieved successfully',
      data: {
        groups: groupsWithAdminFlag,
        count: groupsWithAdminFlag.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested groups (groups user is NOT a member of)
// @route   GET /api/groups/suggested
// @access  Private
export const getSuggestedGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all groups where user is NOT a member
    const groups = await Group.find({ members: { $ne: userId } })
      .populate('adminId', 'name email avatar')
      .sort({ membersCount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Suggested groups retrieved successfully',
      data: {
        groups,
        count: groups.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a group
// @route   POST /api/groups/:groupId/join
// @access  Private
export const joinGroup = async (req, res, next) => {
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

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already a member',
        error: 'You are already a member of this group',
      });
    }

    // Check if user already has a pending request
    const hasPendingRequest = group.pendingRequests.some(
      (req) => req.userId.toString() === userId.toString()
    );

    if (hasPendingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Request pending',
        error: 'You already have a pending join request for this group',
      });
    }

    // If group is private, add to pending requests
    if (group.isPrivate) {
      group.pendingRequests.push({
        userId,
        requestedAt: new Date(),
      });

      await group.save();

      return res.status(200).json({
        success: true,
        message: 'Join request sent',
        data: {
          group,
          status: 'pending',
        },
      });
    }

    // If group is public, add directly to members
    group.members.push(userId);
    await group.save();

    // Populate admin info
    await group.populate('adminId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Joined group successfully',
      data: {
        group,
        status: 'member',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a group
// @route   DELETE /api/groups/:groupId/leave
// @access  Private
export const leaveGroup = async (req, res, next) => {
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

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not a member',
        error: 'You are not a member of this group',
      });
    }

    // Prevent admin from leaving their own group
    if (group.adminId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave group',
        error: 'Admin cannot leave the group. Please transfer admin rights or delete the group',
      });
    }

    // Remove user from members
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: 'Left group successfully',
      data: {
        groupId: group._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups where user is admin with pending join requests
// @route   GET /api/groups/admin/requests
// @access  Private
export const getAdminGroupsWithRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find groups where user is admin and has pending requests
    const groups = await Group.find({
      adminId: userId,
      'pendingRequests.0': { $exists: true }, // Has at least one pending request
    })
      .populate('adminId', 'name email avatar')
      .populate('pendingRequests.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Admin groups with requests retrieved successfully',
      data: {
        groups,
        count: groups.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a join request
// @route   POST /api/groups/:groupId/requests/:userId/approve
// @access  Private
export const approveJoinRequest = async (req, res, next) => {
  try {
    const { groupId, userId: requestUserId } = req.params;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    // Verify user is the admin
    if (group.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can approve join requests',
      });
    }

    // Find the pending request
    const requestIndex = group.pendingRequests.findIndex(
      (req) => req.userId.toString() === requestUserId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
        error: 'No pending join request found for this user',
      });
    }

    // Check if user is already a member
    if (group.members.includes(requestUserId)) {
      // Remove from pending requests anyway
      group.pendingRequests.splice(requestIndex, 1);
      await group.save();

      return res.status(400).json({
        success: false,
        message: 'Already a member',
        error: 'User is already a member of this group',
      });
    }

    // Remove from pending requests
    group.pendingRequests.splice(requestIndex, 1);

    // Add to members
    group.members.push(requestUserId);

    await group.save();

    // Populate admin and request user info
    await group.populate('adminId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Join request approved successfully',
      data: {
        group,
        approvedUserId: requestUserId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a join request
// @route   DELETE /api/groups/:groupId/requests/:userId/reject
// @access  Private
export const rejectJoinRequest = async (req, res, next) => {
  try {
    const { groupId, userId: requestUserId } = req.params;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    // Verify user is the admin
    if (group.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can reject join requests',
      });
    }

    // Find the pending request
    const requestIndex = group.pendingRequests.findIndex(
      (req) => req.userId.toString() === requestUserId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
        error: 'No pending join request found for this user',
      });
    }

    // Remove from pending requests
    group.pendingRequests.splice(requestIndex, 1);

    await group.save();

    res.status(200).json({
      success: true,
      message: 'Join request rejected successfully',
      data: {
        groupId: group._id,
        rejectedUserId: requestUserId,
      },
    });
  } catch (error) {
    next(error);
  }
};
