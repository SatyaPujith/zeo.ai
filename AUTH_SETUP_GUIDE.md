# 🔐 Authentication & MongoDB Setup Guide

## Overview

This guide will help you set up authentication and MongoDB database for zeo.ai.

---

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Tavus API key

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cookie-parser` - Cookie handling
- `express-validator` - Input validation

### 2. Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB**
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**
   ```bash
   # Windows
   mongod

   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   mongo --eval "db.version()"
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 3. Configure Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001

   # Database Configuration
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/zeo-ai
   
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zeo-ai?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7

   # Tavus API Configuration
   TAVUS_API_KEY=your_actual_tavus_api_key
   TAVUS_API_URL=https://tavusapi.com/v2
   TAVUS_REPLICA_ID=r6ae5b6efc9d
   TAVUS_DEFAULT_PERSONA_ID=

   # Frontend URL
   FRONTEND_URL=http://localhost:8081
   ```

3. **Generate a secure JWT secret**
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Or using OpenSSL
   openssl rand -hex 32
   ```

### 4. Start the Server

```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 3001
```

---

## 📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "preferences": {
      "avatarId": null,
      "theme": "auto",
      "notifications": true
    },
    "subscription": {
      "plan": "free",
      "sessionsUsed": 0,
      "sessionsLimit": 10
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User Details
```http
PUT /api/auth/updatedetails
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

#### Logout
```http
GET /api/auth/logout
Authorization: Bearer <token>
```

#### Delete Account
```http
DELETE /api/auth/deleteaccount
Authorization: Bearer <token>
```

### Session Endpoints

#### Create Session
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conv_123",
  "replicaId": "r6ae5b6efc9d",
  "personaId": "persona_456"
}
```

#### Get All Sessions
```http
GET /api/sessions?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Session
```http
GET /api/sessions/:id
Authorization: Bearer <token>
```

#### Update Session
```http
PUT /api/sessions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "emotionData": {
    "emotions": {
      "happiness": 0.8,
      "sadness": 0.1,
      "anger": 0.05,
      "fear": 0.02,
      "surprise": 0.02,
      "disgust": 0.01,
      "neutral": 0.0
    },
    "dominantEmotion": "happiness",
    "confidence": 0.85
  },
  "message": {
    "role": "user",
    "content": "I'm feeling great today!",
    "emotion": "happiness"
  },
  "duration": 120,
  "status": "active"
}
```

#### Rate Session
```http
PUT /api/sessions/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Very helpful session!"
}
```

#### Delete Session
```http
DELETE /api/sessions/:id
Authorization: Bearer <token>
```

#### Get Analytics
```http
GET /api/sessions/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalSessions": 25,
    "totalDuration": 3600,
    "averageDuration": 144,
    "completedSessions": 20,
    "averageRating": 4.5,
    "emotionTrends": {
      "happiness": 0.45,
      "sadness": 0.15,
      "anger": 0.05,
      "fear": 0.10,
      "surprise": 0.10,
      "disgust": 0.05,
      "neutral": 0.10
    },
    "recentSessions": [...]
  }
}
```

---

## 🔒 Security Features

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Passwords are never stored in plain text
- Passwords are excluded from query results by default

### JWT Authentication
- Tokens expire after 7 days (configurable)
- Tokens are stored in HTTP-only cookies
- Tokens include user ID, email, and role

### Protected Routes
- All session endpoints require authentication
- User can only access their own data
- Admin routes can be added with role-based access

### Input Validation
- Email format validation
- Password minimum length (6 characters)
- Required field validation

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  avatar: String,
  role: String (user/admin),
  isVerified: Boolean,
  preferences: {
    avatarId: String,
    theme: String (light/dark/auto),
    notifications: Boolean
  },
  subscription: {
    plan: String (free/premium/enterprise),
    sessionsUsed: Number,
    sessionsLimit: Number,
    startDate: Date,
    endDate: Date
  },
  createdAt: Date,
  lastLogin: Date
}
```

### Session Model
```javascript
{
  user: ObjectId (ref: User),
  conversationId: String,
  replicaId: String,
  personaId: String,
  duration: Number,
  emotionData: [{
    timestamp: Date,
    emotions: {
      happiness: Number,
      sadness: Number,
      anger: Number,
      fear: Number,
      surprise: Number,
      disgust: Number,
      neutral: Number
    },
    dominantEmotion: String,
    confidence: Number
  }],
  messages: [{
    timestamp: Date,
    role: String (user/assistant),
    content: String,
    emotion: String
  }],
  status: String (active/completed/interrupted),
  rating: Number (1-5),
  feedback: String,
  createdAt: Date,
  endedAt: Date
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for token
3. Test each endpoint

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set method, URL, headers, and body
4. Send request

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError: failed to connect to server"**
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check firewall settings

**Error: "Authentication failed"**
- Verify MongoDB Atlas username and password
- Check if IP is whitelisted in Network Access

### JWT Issues

**Error: "Not authorized to access this route"**
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`
- Check if token has expired

**Error: "jwt malformed"**
- Verify JWT_SECRET is set in `.env`
- Check if token is valid

### Session Limit Issues

**Error: "Session limit reached"**
- Free users have 10 sessions limit
- Upgrade to premium or reset counter manually in database

---

## 🚀 Next Steps

### Frontend Integration

1. **Install Axios in client**
   ```bash
   cd client
   npm install axios
   ```

2. **Create API service**
   ```javascript
   // client/src/services/authService.js
   import axios from 'axios';

   const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

   const authService = {
     register: async (userData) => {
       const response = await axios.post(`${API_URL}/auth/register`, userData);
       if (response.data.token) {
         localStorage.setItem('token', response.data.token);
       }
       return response.data;
     },

     login: async (credentials) => {
       const response = await axios.post(`${API_URL}/auth/login`, credentials);
       if (response.data.token) {
         localStorage.setItem('token', response.data.token);
       }
       return response.data;
     },

     logout: () => {
       localStorage.removeItem('token');
     },

     getCurrentUser: async () => {
       const token = localStorage.getItem('token');
       const response = await axios.get(`${API_URL}/auth/me`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       return response.data;
     }
   };

   export default authService;
   ```

3. **Create Auth Context**
   ```javascript
   // client/src/contexts/AuthContext.tsx
   import { createContext, useState, useEffect } from 'react';
   import authService from '../services/authService';

   export const AuthContext = createContext();

   export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       checkAuth();
     }, []);

     const checkAuth = async () => {
       try {
         const token = localStorage.getItem('token');
         if (token) {
           const data = await authService.getCurrentUser();
           setUser(data.user);
         }
       } catch (error) {
         console.error('Auth check failed:', error);
       } finally {
         setLoading(false);
       }
     };

     const login = async (credentials) => {
       const data = await authService.login(credentials);
       setUser(data.user);
       return data;
     };

     const register = async (userData) => {
       const data = await authService.register(userData);
       setUser(data.user);
       return data;
     };

     const logout = () => {
       authService.logout();
       setUser(null);
     };

     return (
       <AuthContext.Provider value={{ user, loading, login, register, logout }}>
         {children}
       </AuthContext.Provider>
     );
   };
   ```

### Production Deployment

1. **Update environment variables**
   - Use strong JWT secret
   - Use MongoDB Atlas connection string
   - Set NODE_ENV=production
   - Update FRONTEND_URL

2. **Enable HTTPS**
   - Use SSL certificates
   - Update cookie settings for secure

3. **Add rate limiting**
   - Implement express-rate-limit
   - Protect against brute force attacks

4. **Add logging**
   - Use winston or morgan
   - Log authentication attempts
   - Monitor errors

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review server logs
3. Check MongoDB connection
4. Verify environment variables

---

**Built with ❤️ by Team KANYARASHI**
