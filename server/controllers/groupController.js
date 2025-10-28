import { Group } from '../models/Group.js';
import { User } from '../models/User.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name, description, tags, isPrivate } = req.body;
    const userId = req.user._id;

    console.log(`Creating group "${name}" - isPrivate: ${isPrivate}`);

    const cleanedTags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    const group = await Group.create({
      name,
      description,
      tags: cleanedTags,
      adminId: userId,
      members: [userId],
      isPrivate: isPrivate || false,
    });

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

export const getMyGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate('adminId', 'name email avatar')
      .sort({ createdAt: -1 });

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

export const getSuggestedGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;

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

    if (group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already a member',
        error: 'You are already a member of this group',
      });
    }

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

    if (group.isPrivate) {
      console.log(`Group "${group.name}" is private - adding user to pending requests`);
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

    console.log(`Group "${group.name}" is public - adding user directly to members`);

    group.members.push(userId);
    await group.save();

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

    if (!group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not a member',
        error: 'You are not a member of this group',
      });
    }

    if (group.adminId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave group',
        error: 'Admin cannot leave the group. Please transfer admin rights or delete the group',
      });
    }

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

export const getAdminGroupsWithRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({
      adminId: userId,
      'pendingRequests.0': { $exists: true },
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

    if (group.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can approve join requests',
      });
    }

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

    if (group.members.includes(requestUserId)) {
      group.pendingRequests.splice(requestIndex, 1);
      await group.save();

      return res.status(400).json({
        success: false,
        message: 'Already a member',
        error: 'User is already a member of this group',
      });
    }

    group.pendingRequests.splice(requestIndex, 1);

    group.members.push(requestUserId);

    await group.save();

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

    if (group.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can reject join requests',
      });
    }

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

export const updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const { name, description, tags, isPrivate } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    if (group.adminId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can update group settings',
      });
    }

    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;
    if (tags !== undefined) {
      const cleanedTags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
      group.tags = cleanedTags;
    }
    if (isPrivate !== undefined) group.isPrivate = isPrivate;

    await group.save();

    await group.populate('adminId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Group updated successfully',
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
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

    if (group.adminId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can delete the group',
      });
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
      data: {
        groupId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeUserFromGroup = async (req, res, next) => {
  try {
    const { groupId, userId: targetUserId } = req.params;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    if (group.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can remove members',
      });
    }

    if (targetUserId === adminId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove admin',
        error: 'Admin cannot remove themselves from the group',
      });
    }

    if (!group.members.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Not a member',
        error: 'User is not a member of this group',
      });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== targetUserId
    );

    await group.save();

    await group.populate('adminId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'User removed from group successfully',
      data: {
        group,
        removedUserId: targetUserId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId).populate('members', 'name email avatar createdAt');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        error: 'The specified group does not exist',
      });
    }

    if (group.adminId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
        error: 'Only the group admin can view member details',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Group members retrieved successfully',
      data: {
        members: group.members,
        count: group.members.length,
        groupId: group._id,
        groupName: group.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
