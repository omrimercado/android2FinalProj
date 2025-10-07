# API Setup Guide

This guide explains how to set up the backend API for the authentication system.

## Backend API Endpoints

The frontend expects the following API endpoints to be available:

### Base URL
```
https://your-backend-api.com/api
```

### Authentication Endpoints

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
curl -X POST https://your-backend-api.com/api/auth/register \
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
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Security Considerations

1. **Use HTTPS** in production
2. **Hash passwords** using bcrypt or similar
3. **Use JWT tokens** with expiration
4. **Validate input** on both frontend and backend
5. **Rate limiting** to prevent brute force attacks
6. **CORS configuration** for cross-origin requests

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
