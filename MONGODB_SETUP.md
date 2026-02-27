# 🗄️ MongoDB Setup Guide for ZEO.AI

## Quick Setup Options

You have two options for MongoDB:

### Option 1: MongoDB Atlas (Recommended - Cloud, Free Tier)
### Option 2: Local MongoDB Installation

---

## ⭐ Option 1: MongoDB Atlas (Recommended)

MongoDB Atlas is a cloud database service with a free tier perfect for development.

### Step 1: Create Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account
3. Verify your email

### Step 2: Create Free Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose region closest to you
5. Cluster Name: `zeo-ai-cluster` (or any name)
6. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `zeoai-admin` (or any username)
5. Password: Click "Autogenerate Secure Password" and COPY IT
6. Database User Privileges: "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - This adds `0.0.0.0/0` to whitelist
4. Click "Confirm"

### Step 5: Get Connection String

1. Go back to "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://zeoai-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you copied earlier
7. Add database name before the `?`:
   ```
   mongodb+srv://zeoai-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/zeo-ai?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

Open `server/.env` and update the MONGODB_URI:

```env
MONGODB_URI=mongodb+srv://zeoai-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/zeo-ai?retryWrites=true&w=majority
```

### Step 7: Test Connection

```bash
cd server
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 3001
```

---

## 💻 Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB Community Server**
   - Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Version: Latest
   - Platform: Windows
   - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install MongoDB as a Service: ✓ (checked)
   - Service Name: MongoDB
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
   - Click "Next" and "Install"

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   - MongoDB should start automatically as a Windows service
   - To check: Open Services (Win + R, type `services.msc`)
   - Look for "MongoDB" service - should be "Running"

5. **Update .env File**
   ```env
   MONGODB_URI=mongodb://localhost:27017/zeo-ai
   ```

6. **Test Connection**
   ```bash
   cd server
   npm run dev
   ```

### For Mac:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongod --version
```

### For Linux (Ubuntu/Debian):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongod --version
```

---

## 🧪 Testing Your Setup

### 1. Test MongoDB Connection

```bash
cd server
npm run dev
```

Expected output:
```
MongoDB Connected: localhost (or your Atlas cluster)
Server running in development mode on port 3001
```

### 2. Test Health Endpoint

Open browser or use curl:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Test User Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
}
```

---

## 🔍 Troubleshooting

### Error: "MongoNetworkError: failed to connect"

**For Atlas:**
- Check if IP is whitelisted (0.0.0.0/0 for development)
- Verify username and password in connection string
- Check if cluster is active (not paused)

**For Local:**
- Check if MongoDB service is running
- Verify port 27017 is not blocked by firewall
- Try: `mongod --dbpath C:\data\db` manually

### Error: "Authentication failed"

- Double-check username and password
- Make sure you replaced `<password>` in connection string
- Verify user has correct permissions in Atlas

### Error: "ECONNREFUSED"

- MongoDB service is not running
- Start service: `brew services start mongodb-community` (Mac)
- Or: `sudo systemctl start mongod` (Linux)
- Or: Check Windows Services

---

## 📊 View Your Data

### Using MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Install and open
3. Connect using your connection string
4. Browse collections: `users`, `sessions`

### Using MongoDB Atlas UI

1. Go to your cluster in Atlas
2. Click "Browse Collections"
3. View and edit data directly

### Using MongoDB Shell

```bash
# Connect to local MongoDB
mongosh

# Connect to Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/zeo-ai" --username zeoai-admin

# Show databases
show dbs

# Use zeo-ai database
use zeo-ai

# Show collections
show collections

# Find all users
db.users.find()

# Find all sessions
db.sessions.find()
```

---

## 🚀 Next Steps

Once MongoDB is connected:

1. ✅ Start the server: `npm run dev`
2. ✅ Test authentication endpoints
3. ✅ Create frontend login/register UI
4. ✅ Integrate with existing Tavus functionality
5. ✅ Test session tracking

---

## 💡 Recommendations

- **For Development**: Use MongoDB Atlas free tier (easier setup, no local installation)
- **For Production**: Use MongoDB Atlas with paid tier for better performance
- **For Testing**: Local MongoDB is fine but requires installation

---

**Need Help?**
- MongoDB Atlas Docs: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- MongoDB Installation: [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)
- Contact: Check AUTH_SETUP_GUIDE.md for API documentation

---

**Built with ❤️ by Team KANYARASHI**
