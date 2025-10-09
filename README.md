# Android Final Project - Professional Social Platform

A modern full-stack social platform with React frontend and Node.js/Express/MongoDB backend following MVC architecture.

## 🚀 Features

### 📱 Core Pages
- **Feed Page** - Professional posts with likes, comments, and sharing
- **Groups Search** - Discover and follow professional groups by category
- **User Profile** - Personal profile with posts, followed groups, and personal info
- **Login/Register** - Secure authentication with form validation

### 🎨 Design Features
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **RTL Support** - Full Hebrew language support
- **Interactive Elements** - Hover effects, transitions, and micro-interactions

### 🔧 Technical Features
- **React Frontend** - Modern React with functional components and hooks
- **Node.js Backend** - Express server with MVC architecture
- **MongoDB Database** - NoSQL database for data persistence
- **REST API** - RESTful API endpoints for client-server communication
- **JWT Authentication** - Secure token-based authentication
- **Form Validation** - Client-side and server-side validation

## 📁 Project Structure

```
android2FinalProj/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API service layer
│   │   └── App.js                 # Main app component
│   └── package.json               # Client dependencies
│
├── server/                         # Node.js backend
│   ├── models/                    # MongoDB schemas (Model)
│   ├── controllers/               # Business logic (Controller)
│   ├── routes/                    # API routes (Router)
│   ├── middleware/                # Auth, validation middleware
│   ├── config/                    # Database and env configuration
│   ├── server.js                  # Server entry point
│   └── package.json               # Server dependencies
│
├── README.md
├── CLAUDE.md
└── API_SETUP.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/omrimercado/android2FinalProj.git
   cd android2FinalProj
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the `server/` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/social-media
   JWT_SECRET=your_jwt_secret_key
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
   cd client
   npm start
   ```

8. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🎯 Available Scripts

### Client (React)
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
- Professional post layout with user info

### 👥 Groups Search
- Search groups by name or description
- Filter by categories (Tech, Business, Design, etc.)
- Follow/unfollow groups
- View group statistics (members, posts)

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

### Typography
- Hebrew RTL support
- Modern font stack
- Responsive font sizes

### Components
- Card-based layouts
- Gradient buttons
- Smooth animations
- Hover effects

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/android2FinalProj"
   ```
3. Add deploy script:
   ```json
   "scripts": {
     "deploy": "gh-pages -d build"
   }
   ```
4. Deploy: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

