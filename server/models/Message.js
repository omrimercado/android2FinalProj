import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

messageSchema.index({ conversationId: 1, createdAt: -1 });

messageSchema.index({ receiverId: 1, isRead: 1 });

messageSchema.statics.getConversationId = function(userId1, userId2) {
  const sorted = [userId1.toString(), userId2.toString()].sort();
  return `${sorted[0]}-${sorted[1]}`;
};

const Message = mongoose.model('Message', messageSchema);

export default Message;

