# 🚨 Emergency System - Ready to Test!

## ✅ What's Been Completed

### Backend (100% Complete)
- ✅ Crisis detection service with keyword analysis
- ✅ Crisis scoring system (10+ = critical intervention)
- ✅ ElevenLabs integration for AI voice generation
- ✅ Twilio integration for calls and SMS
- ✅ Emergency controller with analyze & notify endpoints
- ✅ User model updated with emergencyContacts array
- ✅ Session model updated with crisis tracking
- ✅ All environment variables configured
- ✅ Twilio connection verified

### Frontend (100% Complete)
- ✅ EmergencyContactsManager component for managing contacts
- ✅ Emergency tab in Settings page
- ✅ Test Emergency Call button in Dashboard
- ✅ User type updated with emergencyContacts field
- ✅ Full UI with alerts and loading states

## 🎯 How to Test

### Step 1: Add Emergency Contacts
1. Navigate to **Settings** page
2. Click on the **Emergency** tab (red button with phone icon)
3. Add at least one emergency contact:
   - Name: e.g., "John Doe"
   - Phone: Include country code (e.g., +1234567890)
   - Relationship: e.g., "Friend" (optional)
4. Click **Add Contact**
5. Click **Save Emergency Contacts**

### Step 2: Test the System
1. Go to **Dashboard** page
2. Scroll down to find the **Emergency System Test** card (red border)
3. Click **Test Emergency Call** button
4. The system will:
   - Simulate a crisis message: "I want to end my life, I cannot go on anymore"
   - Analyze the crisis level
   - Generate an AI voice message using ElevenLabs
   - Call your emergency contact via Twilio
   - The AI will explain the situation to the person who answers

### Step 3: What to Expect
- Your emergency contact will receive a phone call
- An AI voice (powered by ElevenLabs) will say something like:
  > "This is an urgent message from ZEO AI mental health platform. Your contact [User Name] has shown signs of severe distress during a conversation. They mentioned thoughts of self-harm. Please reach out to them immediately."
- You'll see a success message in the Dashboard
- The call details will be logged in the session

## 🔧 Configuration

### Twilio Credentials (Already Configured)
```
Account SID: [Your Twilio Account SID from server/.env]
Auth Token: [Your Twilio Auth Token from server/.env]
Phone Number: [Your Twilio Phone Number from server/.env]
```

### ElevenLabs API Key (Already Configured)
```
API Key: [Your ElevenLabs API Key from server/.env]
```

## 📋 API Endpoints

### Analyze Session for Crisis
```
POST /api/emergency/analyze
Authorization: Bearer <token>
Body: {
  "sessionId": "optional",
  "messages": [
    { "role": "user", "content": "message text" }
  ]
}
```

### Trigger Emergency Notification
```
POST /api/emergency/notify
Authorization: Bearer <token>
Body: {
  "sessionId": "optional",
  "messages": [
    { "role": "user", "content": "crisis message" }
  ]
}
```

### Get Crisis Resources
```
GET /api/emergency/resources
```

## 🎨 UI Features

### Dashboard Test Button
- Red-themed emergency card
- Clear description of what will happen
- Loading state while processing
- Success/error alerts with helpful messages
- Disabled state if no emergency contacts

### Settings Emergency Tab
- Add/remove emergency contacts
- Phone number validation
- Relationship field (optional)
- Crisis resources information
- Save functionality with feedback

## 🔍 Crisis Detection Algorithm

The system detects crisis based on:

### High-Risk Keywords (Score: 10 each)
- suicide, kill myself, end my life, want to die
- self-harm, cut myself, hurt myself
- no reason to live, better off dead

### Medium-Risk Keywords (Score: 5 each)
- hopeless, worthless, burden
- can't go on, give up
- overdose, pills

### Low-Risk Keywords (Score: 2 each)
- depressed, sad, lonely
- anxious, scared, worried
- tired, exhausted

### Crisis Levels
- **Score 10+**: Critical - Requires immediate intervention
- **Score 5-9**: High - Needs attention
- **Score 2-4**: Moderate - Monitor closely
- **Score 0-1**: Low - Normal conversation

## 🚀 Application Status

Both servers are currently running:
- **Frontend**: http://localhost:8081 (Vite dev server)
- **Backend**: http://localhost:3001 (Express API)

## 📞 Emergency Resources

Always available:
- **988**: Suicide & Crisis Lifeline
- **911**: Emergency Services
- **741741**: Crisis Text Line (text HOME)

## 🎉 Ready to Demo!

The system is fully functional and ready for testing. Just:
1. Add emergency contacts in Settings
2. Click the test button in Dashboard
3. Your emergency contact will receive the AI call

---

**Note**: This is a test environment. In production, the crisis detection would run automatically during Tavus conversations, not just on button click.
