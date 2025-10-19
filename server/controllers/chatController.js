import Message from '../models/Message.js';
import { User } from '../models/User.js';

// קבלת היסטוריית הודעות בין שני משתמשים
export const getConversation = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;
    
    // בדיקה שהמשתמש מבקש את השיחות שלו בלבד
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'אין הרשאה לצפות בשיחה זו' });
    }

    const conversationId = Message.getConversationId(userId, targetUserId);
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100) // הגבלה ל-100 הודעות אחרונות
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
    console.error('Error fetching conversation:', error);
    res.status(500).json({ 
      success: false,
      message: 'שגיאה בטעינת השיחה' 
    });
  }
};

// קבלת כל השיחות של משתמש
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // מציאת כל ההודעות שהמשתמש שלח או קיבל
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
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
                    { $eq: ['$receiverId', userId] },
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

    // קבלת פרטי המשתמשים
    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const msg = conv.lastMessage;
        const otherUserId = msg.senderId.toString() === userId.toString() 
          ? msg.receiverId 
          : msg.senderId;
        
        const otherUser = await User.findById(otherUserId).select('name email avatar');
        
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

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      success: false,
      message: 'שגיאה בטעינת השיחות' 
    });
  }
};

// סימון הודעות כנקראו
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
      message: 'ההודעות סומנו כנקראו'
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ 
      success: false,
      message: 'שגיאה בעדכון סטטוס ההודעות' 
    });
  }
};

// מחיקת שיחה
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // בדיקה שהמשתמש שייך לשיחה
    const message = await Message.findOne({ conversationId });
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'השיחה לא נמצאה' 
      });
    }

    if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'אין הרשאה למחוק שיחה זו' 
      });
    }

    await Message.deleteMany({ conversationId });

    res.json({
      success: true,
      message: 'השיחה נמחקה בהצלחה'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ 
      success: false,
      message: 'שגיאה במחיקת השיחה' 
    });
  }
};

