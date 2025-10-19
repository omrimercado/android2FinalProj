# API Setup Guide

This guide explains the complete backend API for the social media platform.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Chat API Endpoints](#chat-api-endpoints)
3. [Groups API Endpoints](#groups-api-endpoints)
4. [WebSocket Protocol](#websocket-protocol)
5. [Security Considerations](#security-considerations)
6. [Error Handling](#error-handling)

---

## Base URLs

**REST API:**
```
http://localhost:3001/api
```

**WebSocket:**
```
ws://localhost:3001/chat
```

---

## Quick Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat (requires auth)
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/history/:userId/:targetUserId` - Get chat history
- `PUT /api/chat/messages/read` - Mark messages as read
- `GET /api/chat/unread/:userId` - Get unread message count

### Groups (requires auth)
- `POST /api/groups/create` - Create new group
- `GET /api/groups/my` - Get user's groups
- `GET /api/groups/suggested` - Get suggested groups
- `POST /api/groups/:groupId/join` - Join a group
- `DELETE /api/groups/:groupId/leave` - Leave a group

### WebSocket
- `ws://localhost:3001/chat` - Real-time chat connection

---

## Backend API Endpoints

The frontend expects the following API endpoints to be available:

## Authentication Endpoints

#### 1. Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "birthDate": "1990-01-01"
    }
  }
}

Response (Error):
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password is incorrect"
}
```

#### 2. Register
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "birthDate": "1990-01-01",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "birthDate": "1990-01-01"
    }
  }
}

Response (Error):
{
  "success": false,
  "message": "Registration failed",
  "error": "Email already exists"
}
```

#### 3. Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "Password reset email sent"
}

Response (Error):
{
  "success": false,
  "message": "Failed to send reset email",
  "error": "Email not found"
}
```

#### 4. Verify Token
```
POST /auth/verify-token
Content-Type: application/json
Authorization: Bearer jwt_token_here

Response (Success):
{
  "success": true,
  "message": "Token verified",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "birthDate": "1990-01-01"
    }
  }
}

Response (Error):
{
  "success": false,
  "message": "Token verification failed",
  "error": "Invalid token"
}
```

#### 5. Logout
```
POST /auth/logout
Content-Type: application/json
Authorization: Bearer jwt_token_here

Response (Success):
{
  "success": true,
  "message": "Logout successful"
}

Response (Error):
{
  "success": false,
  "message": "Logout failed",
  "error": "Invalid token"
}
```

## Frontend Configuration

### 1. Update API Base URL

Edit `src/services/api.js` and change the `API_BASE_URL`:

```javascript
const API_BASE_URL = 'https://your-backend-api.com/api';
```

### 2. Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file in the project root:
```
REACT_APP_API_BASE_URL=https://your-backend-api.com/api
```

2. Update `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-api.com/api';
```

## Backend Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// Mock database
const users = [];

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, birthDate, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: 'Email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      name,
      email,
      birthDate,
      password: hashedPassword
    };
    
    users.push(user);
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Login failed',
        error: 'Invalid credentials'
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Login failed',
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: 'Invalid token'
    });
  }
};

// Verify token endpoint
app.post('/api/auth/verify-token', verifyToken, (req, res) => {
  const user = users.find(user => user.id === req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Token verification failed',
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Token verified',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate
      }
    }
  });
});

// Logout endpoint
app.post('/api/auth/logout', verifyToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## Testing the API

### Using Postman or curl

1. **Test Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "birthDate": "1990-01-01",
    "password": "password123"
  }'
```

2. **Test Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Test Get Chat History:**
```bash
curl -X GET http://localhost:3001/api/chat/history/user1/user2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Test Mark Messages as Read:**
```bash
curl -X PUT http://localhost:3001/api/chat/messages/read \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "current_user_id",
    "targetUserId": "other_user_id"
  }'
```

5. **Test Create Group:**
```bash
curl -X POST http://localhost:3001/api/groups/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "React Developers",
    "description": "A community for React developers",
    "tags": ["React", "JavaScript", "Web"],
    "adminId": "user_id"
  }'
```

6. **Test Get My Groups:**
```bash
curl -X GET http://localhost:3001/api/groups/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

7. **Test Join Group:**
```bash
curl -X POST http://localhost:3001/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### WebSocket Test (using wscat)

Install wscat:
```bash
npm install -g wscat
```

Connect and test:
```bash
# Connect
wscat -c ws://localhost:3001/chat

# Send join event
{"type":"join","userId":"user123","userName":"John Doe"}

# Send message
{"type":"message","senderId":"user123","senderName":"John","receiverId":"user456","text":"Hello!"}
```

---

## Chat API Endpoints

All chat endpoints require authentication token in the header:
```
Authorization: Bearer {token}
```

### 1. Get Conversations
```
GET /api/chat/conversations

Response (Success):
{
  "success": true,
  "conversations": [
    {
      "userId": "user_id",
      "userName": "John Doe",
      "lastMessage": "Hello there!",
      "timestamp": "2024-01-15T10:30:00Z",
      "unreadCount": 2
    }
  ]
}
```

### 2. Get Chat History
```
GET /api/chat/history/:userId/:targetUserId?limit=50

Parameters:
- userId: Current user ID
- targetUserId: Target user ID
- limit (optional): Number of messages to retrieve (default: 50)

Response (Success):
{
  "success": true,
  "messages": [
    {
      "_id": "message_id",
      "senderId": "sender_id",
      "senderName": "John Doe",
      "receiverId": "receiver_id",
      "text": "Hello!",
      "conversationId": "conv_id",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Mark Messages as Read
```
PUT /api/chat/messages/read

Body:
{
  "userId": "current_user_id",
  "targetUserId": "other_user_id"
}

Response (Success):
{
  "success": true,
  "message": "Messages marked as read",
  "modifiedCount": 5
}
```

### 4. Get Unread Count
```
GET /api/chat/unread/:userId

Response (Success):
{
  "success": true,
  "unreadCount": 10
}
```

---

## Groups API Endpoints

All group endpoints require authentication token.

### 1. Create Group
```
POST /api/groups/create

Body:
{
  "name": "React Developers Israel",
  "description": "A community for React developers",
  "tags": ["React", "JavaScript", "Web"],
  "adminId": "user_id"
}

Response (Success):
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "_id": "group_id",
    "name": "React Developers Israel",
    "description": "A community for React developers",
    "tags": ["React", "JavaScript", "Web"],
    "adminId": "user_id",
    "members": ["user_id"],
    "membersCount": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get My Groups
```
GET /api/groups/my

Response (Success):
{
  "success": true,
  "groups": [
    {
      "_id": "group_id",
      "name": "React Developers Israel",
      "description": "A community for React developers",
      "tags": ["React", "JavaScript", "Web"],
      "membersCount": 150,
      "isAdmin": true,
      "avatar": "https://example.com/avatar.jpg"
    }
  ]
}
```

### 3. Get Suggested Groups
```
GET /api/groups/suggested

Response (Success):
{
  "success": true,
  "groups": [
    {
      "_id": "group_id",
      "name": "Tech Entrepreneurs",
      "description": "Network with tech entrepreneurs",
      "tags": ["Startup", "Business", "Tech"],
      "membersCount": 2100,
      "avatar": "https://example.com/avatar.jpg"
    }
  ]
}
```

### 4. Join Group
```
POST /api/groups/:groupId/join

Response (Success):
{
  "success": true,
  "message": "Joined group successfully",
  "data": {
    "groupId": "group_id",
    "userId": "user_id"
  }
}
```

### 5. Leave Group
```
DELETE /api/groups/:groupId/leave

Response (Success):
{
  "success": true,
  "message": "Left group successfully"
}
```

---

## WebSocket Protocol

### Connection
```
ws://localhost:3001/chat
```

### Events

#### 1. Join (Client → Server)
```javascript
{
  "type": "join",
  "userId": "user_id",
  "userName": "John Doe"
}
```

#### 2. Message (Client → Server)
```javascript
{
  "type": "message",
  "senderId": "sender_id",
  "senderName": "John Doe",
  "receiverId": "receiver_id",
  "text": "Hello there!"
}
```

#### 3. Message Received (Server → Client)
```javascript
{
  "type": "message",
  "senderId": "sender_id",
  "senderName": "John Doe",
  "receiverId": "receiver_id",
  "text": "Hello there!",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 4. User Status (Server → Client)
```javascript
{
  "type": "user_status",
  "userId": "user_id",
  "status": "online" // or "offline"
}
```

#### 5. Error (Server → Client)
```javascript
{
  "type": "error",
  "message": "Error description"
}
```

#### 6. Typing Indicator (Client → Server)
```javascript
{
  "type": "typing",
  "userId": "user_id",
  "targetUserId": "target_user_id",
  "isTyping": true
}
```

### Connection Flow

1. **Client connects** to WebSocket server
2. **Client sends join event** with user ID and name
3. **Server stores connection** and broadcasts user status
4. **Client sends/receives messages** in real-time
5. **Server saves messages** to MongoDB for offline delivery
6. **Client disconnects** - server broadcasts offline status

---

## Security Considerations

1. **Use HTTPS** in production
2. **Hash passwords** using bcrypt or similar
3. **Use JWT tokens** with expiration
4. **Validate input** on both frontend and backend
5. **Rate limiting** to prevent brute force attacks
6. **CORS configuration** for cross-origin requests
7. **WebSocket authentication** - validate JWT on connection
8. **Message sanitization** - prevent XSS attacks

## Error Handling

The frontend expects all API responses to follow this format:

```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error message"
}
```
