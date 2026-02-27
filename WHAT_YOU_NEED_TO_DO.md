# ✅ What YOU Need to Do (Simple Steps)

## 🎯 Goal
Make emergency calls when user mentions suicide/self-harm in Tavus conversation.

---

## 📝 What I Need From You

### 1. Twilio Credentials (Get from https://console.twilio.com/)

```
Account SID: AC________________________________
Auth Token: ________________________________  
Phone Number: +1__________
```

**How to get:**
- Login to Twilio
- Dashboard shows Account SID and Auth Token
- Buy a phone number (Phone Numbers → Buy a Number)

---

### 2. ElevenLabs API Key (Get from https://elevenlabs.io/)

```
API Key: ________________________________
```

**How to get:**
- Login to ElevenLabs
- Click Profile (top right)
- Go to API Keys
- Click "Generate API Key"
- Copy it

---

## 🚀 What to Do Next

### Option 1: Use My Setup Script (Easiest)

```bash
# Run this in your project folder
node setup-emergency.js
```

It will ask you to paste the 4 things above. Done!

---

### Option 2: Manual Setup

Add these lines to `server/.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ELEVENLABS_API_KEY=your_api_key_here
SERVER_URL=http://localhost:3001
```

---

## 🔧 Install & Run

```bash
# Install Twilio package
cd server
npm install twilio

# Restart server
npm run dev
```

---

## 👤 Add Emergency Contact

### In Your App:
1. Login
2. Go to Settings
3. Click "Emergency" tab
4. Add contact name and phone
5. Save

---

## 🧪 Test It

```bash
node test-emergency.js
```

Enter your login and a test phone number.
You'll get a call and SMS!

---

## ✨ That's It!

Now when someone says "I want to die" in Tavus:
- ✅ System detects it automatically
- ✅ Calls your emergency contact
- ✅ AI voice explains the situation
- ✅ Sends SMS backup

**No coding needed. Just give me those 4 credentials!**

---

## 📞 What Happens

**User in Tavus:** "I can't go on, I want to end it all"

**System (Automatic):**
1. Detects crisis words
2. Calls emergency contact
3. AI says: "Your friend needs urgent help..."
4. Sends SMS with details

**Emergency contact can take action immediately!**

---

## 💰 Cost

- Phone number: ~$1/month
- Each emergency call: ~$0.02/minute
- Each SMS: ~$0.01

Very cheap for life-saving feature!

---

## ❓ Questions?

Just give me:
1. Your Twilio Account SID
2. Your Twilio Auth Token
3. Your Twilio Phone Number
4. Your ElevenLabs API Key

I'll set everything up for you!

---

**Ready? Let's save lives! 🚨**
