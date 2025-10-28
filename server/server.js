import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import websocketService from './services/websocketService.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

websocketService.initialize(server);

app.use(cors());
app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ extended: true, limit: '70mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social Media API Server is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket Chat available at ws://localhost:${PORT}/chat`);
});