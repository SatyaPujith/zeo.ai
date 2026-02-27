# 🚨 Simple Emergency System Setup

## What You Need (Copy These)

### 1. From Twilio (https://console.twilio.com/)
```
Account SID: AC________________________________
Auth Token: ________________________________
Phone Number: +1__________
```

### 2. From ElevenLabs (https://elevenlabs.io/)
```
API Key: ________________________________
```

### 3. Emergency Contact (Your friend/family)
```
Name: ________________
Phone: +1__________
Relationship: ________________
```

---

## Quick Setup (3 Steps)

### Step 1: Install Twilio Package
```bash
cd server
npm install twilio
```

### Step 2: Add to server/.env
```env
# Add these lines to your server/.env file:
TWILIO_ACCOUNT_SID=AC________________________________
TWILIO_AUTH_TOKEN=________________________________
TWILIO_PHONE_NUMBER=+1__________
ELEVENLABS_API_KEY=________________________________
SERVER_URL=http://localhost:3001
```

### Step 3: Restart Server
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

---

## How It Works (Automatic)

1. **User talks to Tavus AI**
2. **System detects crisis words** (suicide, self-harm, etc.)
3. **Automatically calls emergency contact**
4. **AI voice tells them**: "Your friend needs help urgently"
5. **Contact can take action immediately**

---

## Test It

### Add Emergency Contact (One Time)

Use this API call or I'll create a UI for you:

```bash
# Replace YOUR_TOKEN with your login token
curl -X PUT http://localhost:3001/api/auth/updatedetails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyContacts": [
      {
        "name": "John Doe",
        "phone": "+1234567890",
        "relationship": "Friend"
      }
    ]
  }'
```

### Test Emergency Call

```bash
curl -X POST http://localhost:3001/api/emergency/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "contactName": "Test Contact"
  }'
```

You should receive a call and SMS!

---

## Crisis Words That Trigger Alert

- "kill myself"
- "end my life"  
- "want to die"
- "suicide"
- "can't go on"
- "no hope"
- "better off dead"

When user says these in Tavus conversation → **Automatic emergency call**

---

## What Happens During Emergency Call

**AI Voice Says:**
> "Hello [Contact Name]. This is an urgent automated message from ZEO AI.
> 
> Your friend [User Name] is showing signs of severe distress in their conversation. They mentioned [crisis indicators].
> 
> Please contact them immediately. If you cannot reach them, call 911.
> 
> For crisis support, call 988 Suicide Prevention Lifeline.
> 
> Press 1 to hear this again."

**Also sends SMS backup** with same info.

---

## Need Help?

Just give me:
1. Your Twilio Account SID
2. Your Twilio Auth Token  
3. Your Twilio Phone Number
4. Your ElevenLabs API Key

I'll add them to your .env file!
