# 🚨 How the Emergency System Works - Complete Explanation

## Overview
When a user shows signs of severe distress (suicidal thoughts, self-harm), the system automatically calls their emergency contacts with an AI-generated voice message explaining the situation.

---

## The Complete Flow

### Step 1: Crisis Detection
```
User talks to Tavus AI → Messages analyzed → Crisis keywords detected
```

**Crisis Keywords Detected:**
- High Risk (10 points): "suicide", "kill myself", "end my life", "want to die"
- Medium Risk (5 points): "hopeless", "worthless", "can't go on"
- Low Risk (2 points): "depressed", "anxious", "lonely"

**Crisis Levels:**
- Score 10+: CRITICAL - Immediate intervention required
- Score 5-9: HIGH - Needs attention
- Score 2-4: MODERATE - Monitor
- Score 0-1: LOW - Normal

### Step 2: Emergency Notification Triggered
```
Crisis Score ≥ 10 → System triggers emergency notification
```

### Step 3: AI Voice Generation (ElevenLabs)
```javascript
// The system creates a message like this:
const message = `
This is an urgent message from ZEO AI mental health platform. 
Your contact, John Doe, has shown signs of severe distress during 
a conversation with our AI therapist. They mentioned thoughts of 
self-harm and suicide. This is a critical situation that requires 
immediate attention. Please reach out to them as soon as possible 
or contact emergency services if needed. Time is of the essence.
`;

// ElevenLabs converts this text to realistic AI voice
const audioFile = await elevenLabs.textToSpeech(message);
```

**What ElevenLabs Does:**
- Takes the text message
- Converts it to natural-sounding human voice
- Returns an audio file (MP3)
- Voice sounds like a professional, calm person

### Step 4: Twilio Makes the Call
```javascript
// Twilio calls the emergency contact
await twilio.calls.create({
  to: '+1234567890',           // Emergency contact's phone
  from: '+12282275556',         // Your Twilio number
  url: 'audio-file-url'         // The AI voice message
});
```

**What Happens:**
1. Emergency contact's phone rings
2. They answer the call
3. They hear the AI voice explaining:
   - Who is calling (ZEO AI platform)
   - Who needs help (the user's name)
   - What happened (crisis detected, suicidal thoughts)
   - What to do (reach out immediately or call 911)

### Step 5: SMS Backup
```javascript
// Also sends a text message
await twilio.messages.create({
  to: '+1234567890',
  from: '+12282275556',
  body: '🚨 URGENT: Your contact needs immediate help. They showed signs of crisis. Please call them or emergency services now.'
});
```

---

## Example Scenario

### User's Conversation:
```
User: "I can't do this anymore. I want to end my life."
AI: "I hear you're in pain. Can you tell me more?"
User: "Everything is hopeless. There's no way out."
```

### What Happens Behind the Scenes:

1. **Crisis Detection Analyzes:**
   - "end my life" = 10 points
   - "hopeless" = 5 points
   - "no way out" = 5 points
   - **Total: 20 points = CRITICAL**

2. **System Generates Message:**
   ```
   "This is an urgent message from ZEO AI. Your contact, 
   Sarah Johnson, has shown signs of severe distress. 
   They mentioned wanting to end their life and feeling 
   hopeless. Please reach out immediately."
   ```

3. **ElevenLabs Creates Voice:**
   - Converts text to calm, professional voice
   - Saves as audio file

4. **Twilio Calls Emergency Contact:**
   - Calls: +1-555-123-4567 (Mom)
   - Mom's phone rings
   - She answers
   - Hears: AI voice explaining the situation
   - Duration: ~30 seconds

5. **SMS Sent:**
   - Text message with crisis alert
   - Includes user's name
   - Urges immediate action

---

## The AI Voice

### What It Sounds Like:
- **Tone**: Calm, professional, urgent but not panicked
- **Speed**: Clear and measured
- **Quality**: Natural human voice (not robotic)
- **Language**: English (can be configured)

### Example Script:
```
"Hello, this is an automated urgent message from ZEO AI 
mental health platform. Your emergency contact, [User Name], 
has shown signs of severe emotional distress during a 
conversation with our AI therapist. 

They expressed thoughts of self-harm and mentioned feeling 
hopeless. This is a critical situation that requires 
immediate attention. 

Please reach out to them as soon as possible. If you cannot 
reach them, please contact emergency services at 911. 

Time is of the essence. Thank you."
```

---

## Technology Stack

### 1. ElevenLabs (AI Voice)
- **Purpose**: Text-to-Speech conversion
- **Input**: Crisis message text
- **Output**: Natural-sounding voice audio (MP3)
- **Voice**: Professional, empathetic tone
- **Cost**: ~$0.30 per 1000 characters

### 2. Twilio (Phone Calls & SMS)
- **Purpose**: Make phone calls and send texts
- **Phone Number**: +12282275556 (your Twilio number)
- **Features**:
  - Voice calls with audio playback
  - SMS messaging
  - Call status tracking
  - Delivery reports
- **Cost**: 
  - Calls: ~$0.013 per minute
  - SMS: ~$0.0075 per message

### 3. Crisis Detection (Custom Algorithm)
- **Purpose**: Analyze conversation for crisis keywords
- **Method**: Keyword matching + scoring
- **Output**: Crisis level (LOW, MODERATE, HIGH, CRITICAL)

---

## Test Button Flow

When you click "Test Emergency Call" in Dashboard:

```javascript
1. Button clicked
   ↓
2. Simulates crisis messages:
   "I want to end my life, I cannot go on anymore"
   ↓
3. Sends to /api/emergency/notify
   ↓
4. Backend analyzes crisis (Score: 20 = CRITICAL)
   ↓
5. Generates AI voice message with ElevenLabs
   ↓
6. Twilio calls your emergency contact
   ↓
7. Contact hears AI voice explaining situation
   ↓
8. SMS backup sent
   ↓
9. Success message shown in Dashboard
```

---

## What the Emergency Contact Experiences

### Phone Call:
1. **Phone rings** - Shows your Twilio number (+12282275556)
2. **They answer** - "Hello?"
3. **AI voice speaks** - Clear, professional voice
4. **Message delivered** - ~30 seconds
5. **Call ends** - Automatic

### Text Message:
```
🚨 URGENT: Your contact [Name] needs immediate help. 
They showed signs of severe crisis during a mental 
health session. Please call them or emergency services 
immediately.
```

---

## Real-World Integration

### In Production (with Tavus):
```
User talks to Tavus AI therapist
   ↓
Conversation transcribed in real-time
   ↓
Each message analyzed for crisis keywords
   ↓
If crisis detected (score ≥ 10):
   ↓
Emergency notification triggered automatically
   ↓
AI calls emergency contacts
   ↓
User gets immediate help
```

### Current Test Mode:
```
Click "Test Emergency Call" button
   ↓
Simulates crisis conversation
   ↓
Triggers emergency notification
   ↓
AI calls your emergency contact
   ↓
You can verify the system works
```

---

## Why This System is Powerful

1. **Immediate Response**: No human delay
2. **24/7 Availability**: Works anytime
3. **Professional Delivery**: AI voice is calm and clear
4. **Multiple Channels**: Call + SMS for redundancy
5. **Automatic**: No user action needed
6. **Life-Saving**: Can prevent suicide attempts

---

## Privacy & Ethics

- ✅ Only triggers on severe crisis (score ≥ 10)
- ✅ User adds their own emergency contacts
- ✅ Clear message about what happened
- ✅ Respects user privacy (no recording shared)
- ✅ Complies with mental health guidelines

---

## Current Status

### ✅ Implemented:
- Crisis detection algorithm
- ElevenLabs voice generation
- Twilio call/SMS integration
- Emergency contacts management
- Test button in Dashboard

### 🔧 To Test:
1. Add emergency contact in Settings
2. Click test button in Dashboard
3. Your contact receives AI call
4. Verify the voice message is clear

---

## Summary

**In Simple Terms:**
When someone is suicidal, the system:
1. Detects the crisis automatically
2. Creates a voice message using AI
3. Calls their emergency contacts
4. The contact hears an AI voice explaining the situation
5. The contact can then help immediately

**The AI voice sounds like a professional crisis counselor calling to alert them about their loved one's emergency.**

It's like having a 24/7 automated crisis response team that never sleeps and responds in seconds.
