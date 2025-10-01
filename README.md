# Android Final Project - Professional Social Platform

A modern React-based social platform inspired by professional networking features, built with Create React App.

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
- **React Hooks** - Modern React with functional components
- **State Management** - Local state management with useState
- **Form Validation** - Client-side validation for all forms
- **Component Architecture** - Modular, reusable components
- **CSS Styling** - Custom CSS with modern design patterns

## 📁 Project Structure

```
src/
├── components/
│   ├── Feed.js & Feed.css          # Main feed page
│   ├── GroupsSearch.js & GroupsSearch.css  # Groups discovery
│   ├── Profile.js & Profile.css    # User profile
│   ├── Login.js & Login.css        # Login page
│   └── Register.js & Register.css  # Registration page
├── App.js                          # Main app component with routing
├── App.css                         # Global styles and navigation
└── index.js                        # App entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/omrimercado/android2FinalProj.git
   cd android2FinalProj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: This is a one-way operation!**
Ejects from Create React App to get full control over the build process.

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

