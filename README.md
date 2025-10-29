# Stay Tuned - Professional Social Platform

A modern full-stack social platform with React frontend and Node.js/Express/MongoDB backend following MVC architecture.

 **Stay Tuned** - Connect with friends, join groups, and stay updated with your community!

## 🚀 Features

### 📱 Core Pages
- **Feed Page** - Professional posts with likes, comments, and sharing
- **Groups Page** - Create, join, and manage professional groups
- **User Profile** - Personal profile with posts, followed groups, and personal info
- **Real-time Chat** - WebSocket-based personal messaging between users
- **Login/Register** - Secure authentication with form validation

### 🎨 Design Features
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Real-time Updates** - Live chat with WebSocket connection

### 🔧 Technical Features
- **React Frontend** - Modern React with functional components and hooks
- **Node.js Backend** - Express server with MVC architecture
- **MongoDB Database** - NoSQL database for data persistence
- **REST API** - RESTful API endpoints for client-server communication
- **WebSocket** - Real-time chat communication
- **JWT Authentication** - Secure token-based authentication
- **Form Validation** - Client-side and server-side validation
- **Docker Support** - Full Docker containerization for all services

## 🏗️ System Architecture

**Stay Tuned** follows a modern microservices architecture with containerized components working together seamlessly.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Frontend (React) - Port 3000                                 │  │
│  │  • React 18 with Hooks & Context API                          │  │
│  │  • Modern UI/UX with CSS3 animations                          │  │
│  │  • WebSocket client for real-time chat                        │  │
│  │  • REST API client for data operations                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↕
                        HTTP REST API / WebSocket
                                    ↕
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Backend (Node.js + Express) - Port 3001                      │  │
│  │  • Express.js RESTful API                                     │  │
│  │  • WebSocket server (ws) for real-time messaging              │  │
│  │  • JWT authentication & authorization                         │  │
│  │  • MVC architecture (Models, Controllers, Routes)             │  │
│  │  • Middleware for validation & error handling                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↕
                              Mongoose ODM
                                    ↕
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  MongoDB - Port 27017                                         │  │
│  │  • NoSQL document database                                    │  │
│  │  • Collections: users, posts, groups, messages                │  │
│  │  • Indexes for optimized queries                              │  │
│  │  • Data persistence and replication                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Mongo Express - Port 8081                                    │  │
│  │  • Web-based MongoDB admin interface                          │  │
│  │  • Database visualization and management                      │  │
│  │  • Query execution and data manipulation                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↕
                          Ollama API Integration
                                    ↕
┌─────────────────────────────────────────────────────────────────────┐
│                          AI LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Ollama - Port 11434                                          │  │
│  │  • Local LLM (Large Language Model) server                    │  │
│  │  • AI-powered content generation                              │  │
│  │  • Natural language processing                                │  │
│  │  • Post suggestions and text enhancement                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔧 Service Components

#### 1. **Frontend - React Application** 🎨
- **Technology:** React 18, JavaScript ES6+, CSS3
- **Port:** `3000`
- **Purpose:** User interface and client-side logic
- **Key Features:**
  - Single Page Application (SPA) with React Router
  - Real-time updates via WebSocket connection
  - Responsive design for all devices
  - State management with Context API and Hooks
  - Service layer for API communication
- **Docker Image:** `node:18-alpine`

#### 2. **Backend - Node.js Server** 🚀
- **Technology:** Node.js, Express.js, WebSocket (ws)
- **Port:** `3001`
- **Purpose:** Business logic, API endpoints, and real-time communication
- **Key Features:**
  - RESTful API with Express.js
  - WebSocket server for real-time chat
  - JWT-based authentication
  - MVC architecture pattern
  - Middleware for validation and error handling
  - Integration with MongoDB and Ollama
- **Docker Image:** `node:18-alpine`
- **API Endpoints:**
  - `/api/auth` - Authentication (login, register)
  - `/api/posts` - Post management
  - `/api/groups` - Group operations
  - `/api/chat` - Chat and messaging
  - `/api/search` - Advanced search
  - `/api/ai` - AI-powered features
  - `/api/statistics` - Analytics and stats

#### 3. **MongoDB - Database** 💾
- **Technology:** MongoDB 7.0 (NoSQL)
- **Port:** `27017`
- **Purpose:** Primary data storage
- **Key Features:**
  - Document-based storage
  - Flexible schema design
  - High performance and scalability
  - Automatic indexing
- **Collections:**
  - `users` - User accounts and profiles
  - `posts` - Social media posts
  - `groups` - Community groups
  - `messages` - Chat messages and history
- **Docker Image:** `mongo:7.0`
- **Data Persistence:** Volume mounted to `./data/mongodb`

#### 4. **Mongo Express - Database Admin** 🗄️
- **Technology:** Mongo Express (Node.js web app)
- **Port:** `8081`
- **Purpose:** Database management interface
- **Key Features:**
  - Visual database browser
  - Execute queries directly
  - View and edit documents
  - Database statistics and monitoring
  - User-friendly admin panel
- **Docker Image:** `mongo-express:latest`
- **Credentials:** 
  - Username: `admin`
  - Password: `pass` (change in production!)

#### 5. **Ollama - AI/LLM Service** 🤖
- **Technology:** Ollama (Local LLM server)
- **Port:** `11434`
- **Purpose:** AI-powered content generation and enhancement
- **Key Features:**
  - Local Large Language Model
  - AI post generation and suggestions
  - Content enhancement and refinement
  - Natural language processing
  - Privacy-focused (runs locally)
- **Docker Image:** `ollama/ollama:latest`
- **Models:** Configurable (llama2, mistral, etc.)
- **Integration:** Backend connects via REST API

### 🔄 Data Flow

1. **User Action** → Frontend captures user interaction
2. **API Request** → Frontend sends HTTP request to Backend
3. **Authentication** → Backend validates JWT token
4. **Business Logic** → Backend processes request (may call Ollama for AI features)
5. **Database Operation** → Backend queries/updates MongoDB
6. **Response** → Backend sends response to Frontend
7. **UI Update** → Frontend updates interface
8. **Real-time Sync** → WebSocket broadcasts updates to connected clients

### 🔐 Security Architecture

- **Authentication:** JWT tokens with secure signing
- **Authorization:** Role-based access control
- **Data Validation:** Client-side and server-side validation
- **Password Security:** bcrypt hashing with salt
- **CORS:** Configured for secure cross-origin requests
- **Environment Variables:** Sensitive data stored securely
- **Database Security:** MongoDB authentication enabled
- **WebSocket Security:** Token-based connection authentication

### 📡 Communication Protocols

- **REST API:** JSON over HTTP/HTTPS
- **WebSocket:** Real-time bidirectional communication
- **MongoDB Protocol:** Mongoose ODM for data operations
- **Ollama API:** HTTP REST API for AI features

## 📁 Project Structure

```
Android2FinalPro/
├── frontend/                       # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ChatWindow.jsx    # Real-time chat component
│   │   │   ├── NewGroup.jsx      # Group creation modal
│   │   │   └── ...
│   │   ├── pages/                 # Page-level components
│   │   │   ├── FeedPage.jsx      # Main feed
│   │   │   ├── GroupsPage.jsx    # Groups management
│   │   │   ├── MyProfilePage.jsx # User profile
│   │   │   └── ...
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API service layer
│   │   │   ├── api.js            # REST API service
│   │   │   ├── chatApi.js        # Chat & WebSocket service
│   │   │   └── index.js          # Service exports
│   │   └── App.js                 # Main app component
│   ├── Dockerfile                 # Frontend Docker config
│   └── package.json               # Client dependencies
│
├── server/                         # Node.js backend
│   ├── models/                    # MongoDB schemas (Model)
│   │   ├── User.js               # User model
│   │   └── Message.js            # Chat message model
│   ├── controllers/               # Business logic (Controller)
│   │   ├── authController.js     # Authentication
│   │   └── chatController.js     # Chat & messaging
│   ├── routes/                    # API routes (Router)
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── chatRoutes.js         # Chat endpoints
│   ├── middleware/                # Auth, validation middleware
│   ├── config/                    # Database and env configuration
│   ├── server.js                  # Server entry point (HTTP + WebSocket)
│   ├── Dockerfile                 # Backend Docker config
│   └── package.json               # Server dependencies
│
├── docker-compose.yml              # Docker orchestration
├── DOCKER_SETUP.md                 # Docker access points
├── README.md
└── API_SETUP.md
```

## 🛠️ Installation & Setup

### Option 1: Docker (Recommended) 🐳

**Prerequisites:** Docker and Docker Compose installed

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Android2FinalPro.git
   cd Android2FinalPro
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```


See [DOCKER_SETUP.md](DOCKER_SETUP.md) for all service URLs.

---

### Option 2: Manual Setup

**Prerequisites:**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Android2FinalPro.git
   cd Android2FinalPro
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**
   
   Create `.env` in `server/` directory:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/social-media
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=24h
   ```
   
   Create `.env` in `frontend/` directory:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=ws://localhost:3001/chat
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - WebSocket: ws://localhost:3001/chat

## 🎯 Available Scripts

### Docker Commands
- `docker-compose up --build` - Start all services (MongoDB, Backend, Frontend)
- `docker-compose down` - Stop all services
- `docker-compose logs -f` - View all logs
- `docker-compose restart server` - Restart specific service

### Frontend (React)
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Server (Node.js)
- `npm start` - Runs the server in production mode
- `npm run dev` - Runs the server with nodemon (auto-restart)

## 📱 Pages Overview

### 🏠 Feed Page
- View and create professional posts
- Like, comment, and share posts
- Real-time interaction with posts
- **Personal Chat** - Click user avatar to start 1-on-1 chat
- Professional post layout with user info

### 👥 Groups Page
- **My Groups** - View groups you've joined with admin badges
- **Suggested Groups** - Discover new groups to join
- **Create Group** - Modal for creating new groups (name, description, tags)
- Join/Leave groups functionality
- Search groups by name, description, or tags

### 💬 Real-time Chat
- **WebSocket-based messaging** - Instant message delivery
- **Chat History** - Load previous conversations from database
- **Online Status** - See who's online
- **Offline Messages** - Send messages even when recipient is offline
- **Read Receipts** - Track message delivery and read status
- Click any user avatar to open chat window

### 👤 User Profile
- **Posts Tab** - Personal posts with engagement stats
- **Groups Tab** - Followed groups with activity info
- **Info Tab** - Personal and professional information
- Profile statistics (followers, following, posts)

### 🔐 Authentication
- **Login** - Email and password authentication
- **Register** - Full registration with validation
- Form validation and error handling
- Smooth navigation between pages

## 🎨 Design System

### Colors
- Primary: `#667eea` (Blue gradient)
- Secondary: `#764ba2` (Purple gradient)
- Text: `#2c3e50` (Dark gray)
- Background: `#f8f9fa` (Light gray)
- Online Status: `#10b981` (Green)
- Offline Status: `#94a3b8` (Gray)

### Components
- Card-based layouts
- Gradient buttons
- Smooth animations
- Hover effects
- Modal overlays
- Floating chat windows
- Real-time status indicators

## 🔌 API Documentation

See [API_SETUP.md](API_SETUP.md) for complete API documentation including:
- Authentication endpoints
- Chat & messaging endpoints
- Group management endpoints
- WebSocket protocol details

## 🚀 Deployment

### Docker Production Deployment
1. Update `JWT_SECRET` in docker-compose.yml
2. Set `NODE_ENV=production`
3. Build and deploy:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Manual Production Build
```bash
# Frontend
cd frontend
npm run build


```

### Environment Variables for Production
- Set secure `JWT_SECRET`
- Update `MONGODB_URI` to production database
- Configure CORS for production domains
- Set appropriate `REACT_APP_API_URL` and `REACT_APP_WS_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request


