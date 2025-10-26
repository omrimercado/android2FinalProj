import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import Message from './models/Message.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/chat' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social Media API Server is running' });
});

app.use(notFound);
app.use(errorHandler);

const connections = new Map();

wss.on('connection', (ws, req) => {
  console.log('✅ New WebSocket connection');

  let userId = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data.type, 'from:', data.userId || userId);

      switch(data.type) {
        case 'join':
          userId = data.userId;
          connections.set(userId, ws);

          console.log(`👤 User ${data.userName} (ID: ${userId}) joined`);
          console.log(`👥 Total connections: ${connections.size}`);

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

          const isTargetOnline = connections.has(data.targetUserId);
          ws.send(JSON.stringify({
            type: 'user_status',
            userId: data.targetUserId,
            isOnline: isTargetOnline
          }));

          const targetWsOnJoin = connections.get(data.targetUserId);
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
          console.log('💾 Message saved to database');

          const messageData = {
            id: newMessage._id,
            text: newMessage.text,
            senderId: newMessage.senderId,
            senderName: newMessage.senderName,
            timestamp: newMessage.createdAt
          };

          const targetWs = connections.get(data.targetUserId);
          let delivered = false;

          if (targetWs && targetWs.readyState === ws.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'message',
              ...messageData
            }));

            newMessage.deliveredAt = new Date();
            await newMessage.save();
            delivered = true;

            console.log(`💬 Message delivered to ${data.targetUserId} (online)`);
          } else {
            console.log(`📬 Message saved for ${data.targetUserId} (offline)`);
          }

          ws.send(JSON.stringify({
            type: 'message',
            ...messageData,
            delivered
          }));
          break;

        case 'typing':
          const targetTypingWs = connections.get(data.targetUserId);
          if (targetTypingWs && targetTypingWs.readyState === ws.OPEN) {
            targetTypingWs.send(JSON.stringify({
              type: 'typing',
              userId: data.userId
            }));
          }
          break;

        default:
          console.log('❓ Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      connections.delete(userId);
      console.log(`👋 User ${userId} disconnected`);
      console.log(`👥 Total connections: ${connections.size}`);

      connections.forEach((connection) => {
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
    console.error('❌ WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`💬 WebSocket Chat available at ws://localhost:${PORT}/chat`);
});