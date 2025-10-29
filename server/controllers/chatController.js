import Message from '../models/Message.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

export const getConversation = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to view this conversation' });
    }

    const conversationId = Message.getConversationId(userId, targetUserId);
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg._id,
        text: msg.text,
        senderId: msg.senderId,
        senderName: msg.senderName,
        timestamp: msg.createdAt,
        isRead: msg.isRead,
        delivered: msg.deliveredAt !== null
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading conversation'
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
    console.log('getUserConversations - userId:', userId);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userIdObj },
            { receiverId: userIdObj }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiverId', userIdObj] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    console.log('Found conversations:', messages.length);

    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const msg = conv.lastMessage;
        const otherUserId = msg.senderId.toString() === userId.toString() 
          ? msg.receiverId 
          : msg.senderId;
        
        const otherUser = await User.findById(otherUserId).select('name email avatar');
        
        if (!otherUser) {
          console.warn('Other user not found:', otherUserId);
          return null;
        }
        
        return {
          conversationId: conv._id,
          otherUser: {
            id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
            avatar: otherUser.avatar
          },
          lastMessage: {
            text: msg.text,
            timestamp: msg.createdAt,
            senderId: msg.senderId
          },
          unreadCount: conv.unreadCount
        };
      })
    );

    // Filter out null values
    const validConversations = conversations.filter(conv => conv !== null);
    
    console.log('Returning conversations:', validConversations.length);

    res.json({
      success: true,
      conversations: validConversations
    });
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading conversations',
      error: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating message status'
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({ conversationId });
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this conversation'
      });
    }

    await Message.deleteMany({ conversationId });

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation'
    });
  }
};

