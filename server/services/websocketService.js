import { WebSocketServer } from 'ws';
import Message from '../models/Message.js';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.connections = new Map();
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server, path: '/chat' });

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');

      let userId = null;

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          console.log('Received:', data.type, 'from:', data.userId || userId);

          switch(data.type) {
            case 'join':
              userId = data.userId;
              this.connections.set(userId, ws);

              console.log(`User ${data.userName} (ID: ${userId}) joined`);
              console.log(`Total connections: ${this.connections.size}`);

              const conversationId = Message.getConversationId(userId, data.targetUserId);
              const history = await Message.find({ conversationId })
                .sort({ createdAt: 1 })
                .limit(50)
                .lean();

              if (history.length > 0) {
                ws.send(JSON.stringify({
                  type: 'history',
                  messages: history.map(msg => ({
                    id: msg._id,
                    text: msg.text,
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    timestamp: msg.createdAt
                  }))
                }));
              }

              const isTargetOnline = this.connections.has(data.targetUserId);
              ws.send(JSON.stringify({
                type: 'user_status',
                userId: data.targetUserId,
                isOnline: isTargetOnline
              }));

              const targetWsOnJoin = this.connections.get(data.targetUserId);
              if (targetWsOnJoin && targetWsOnJoin.readyState === ws.OPEN) {
                targetWsOnJoin.send(JSON.stringify({
                  type: 'user_status',
                  userId: userId,
                  isOnline: true
                }));
              }
              break;

            case 'message':
              const newMessage = new Message({
                senderId: data.senderId,
                senderName: data.senderName,
                receiverId: data.targetUserId,
                text: data.text,
                conversationId: Message.getConversationId(data.senderId, data.targetUserId)
              });

              await newMessage.save();
              console.log('Message saved to database');

              const messageData = {
                id: newMessage._id,
                text: newMessage.text,
                senderId: newMessage.senderId,
                senderName: newMessage.senderName,
                timestamp: newMessage.createdAt
              };

              const targetWs = this.connections.get(data.targetUserId);
              let delivered = false;

              if (targetWs && targetWs.readyState === ws.OPEN) {
                targetWs.send(JSON.stringify({
                  type: 'message',
                  ...messageData
                }));

                newMessage.deliveredAt = new Date();
                await newMessage.save();
                delivered = true;

                console.log(`Message delivered to ${data.targetUserId} (online)`);
              } else {
                console.log(`Message saved for ${data.targetUserId} (offline)`);
              }

              ws.send(JSON.stringify({
                type: 'message',
                ...messageData,
                delivered
              }));
              break;

            case 'typing':
              const targetTypingWs = this.connections.get(data.targetUserId);
              if (targetTypingWs && targetTypingWs.readyState === ws.OPEN) {
                targetTypingWs.send(JSON.stringify({
                  type: 'typing',
                  userId: data.userId
                }));
              }
              break;

            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        if (userId) {
          this.connections.delete(userId);
          console.log(`User ${userId} disconnected`);
          console.log(`Total connections: ${this.connections.size}`);

          this.connections.forEach((connection) => {
            if (connection.readyState === ws.OPEN) {
              connection.send(JSON.stringify({
                type: 'user_status',
                userId: userId,
                isOnline: false
              }));
            }
          });
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  getConnectionCount() {
    return this.connections.size;
  }

  isUserOnline(userId) {
    return this.connections.has(userId);
  }

  closeAll() {
    this.connections.forEach((ws) => {
      ws.close();
    });
    this.connections.clear();
    console.log('All WebSocket connections closed');
  }
}

export default new WebSocketService();