# 🧪 Test Emergency System - Step by Step

## Problem: Can't See Test Button?

The test button IS in the code. Try these fixes:

### Fix 1: Hard Refresh Browser
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Fix 2: Clear Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for any errors
4. Share them if you see any

---

## Where to Find the Test Button

### Location in Dashboard:
```
1. Login to your account
2. Go to Dashboard (http://localhost:8081/dashboard)
3. Scroll down past the stats cards
4. Look for a RED-BORDERED card
5. Title: "Emergency System Test"
6. It's between stats and mood tracking
```

### Visual Clues:
- 🔴 Red border
- 📞 Phone icon
- Red "Test Emergency Call" button
- Warning text about crisis simulation

---

## Complete Testing Guide

### Step 1: Add Emergency Contact (REQUIRED FIRST!)

```
1. Go to Settings (http://localhost:8081/settings)
2. Click "Emergency" tab (red button on left)
3. Click "Add Emergency Contact"
4. Fill in:
   Name: Your Name or Friend's Name
   Phone: +1234567890 (MUST include country code!)
   Relationship: Friend/Family (optional)
5. Click "Add Contact"
6. Click "Save Emergency Contacts" (big red button)
7. Wait for success message
```

**IMPORTANT**: Use a real phone number you can access to test!

### Step 2: Test the System

```
1. Go to Dashboard
2. Scroll down to find "Emergency System Test" card
3. Click "Test Emergency Call" button
4. Wait 5-10 seconds
5. Check your phone!
```

### Step 3: What Happens

**On Your Phone:**
1. Phone rings (from +12282275556)
2. Answer the call
3. Hear AI voice say something like:

```
"This is an urgent message from ZEO AI mental health platform.
Your contact [Your Name] has shown signs of severe distress 
during a conversation with our AI therapist. They mentioned 
thoughts of self-harm and suicide. This is a critical situation 
that requires immediate attention. Please reach out to them 
as soon as possible or contact emergency services if needed."
```

4. Call lasts ~30 seconds
5. You also get an SMS text message

**In Dashboard:**
- Success message appears
- Shows "Emergency notification sent to 1 contact(s)"
- Green checkmark icon

---

## How It Actually Works

### The Technology:

1. **Crisis Detection** (crisisDetection.js)
   - Analyzes messages for keywords
   - Scores severity (0-20+)
   - Triggers if score ≥ 10

2. **ElevenLabs** (elevenLabs.js)
   - Converts text to AI voice
   - Natural, professional tone
   - Generates MP3 audio file

3. **Twilio** (twilioService.js)
   - Makes the phone call
   - Plays the AI voice
   - Sends SMS backup

### The Flow:

```
Test Button Clicked
    ↓
Simulates Crisis Message:
"I want to end my life, I cannot go on anymore"
    ↓
Crisis Detection Analyzes:
Score = 20 (CRITICAL)
    ↓
Generates AI Voice Message:
"Your contact needs help..."
    ↓
ElevenLabs Creates Audio:
Text → Natural Voice (MP3)
    ↓
Twilio Makes Call:
Calls +1234567890
    ↓
Emergency Contact Answers:
Hears AI voice explaining
    ↓
SMS Sent:
"🚨 URGENT: Your contact needs help"
    ↓
Success!
```

---

## What the AI Voice Says

### Example Script:

```
"Hello, this is an automated urgent message from ZEO AI 
mental health platform. 

Your emergency contact, [User's Name], has shown signs of 
severe emotional distress during a conversation with our 
AI therapist. 

They expressed thoughts of self-harm and mentioned feeling 
hopeless. This is a critical situation that requires 
immediate attention. 

Please reach out to them as soon as possible. If you cannot 
reach them, please contact emergency services at 911. 

Time is of the essence. Thank you."
```

### Voice Characteristics:
- **Tone**: Calm, professional, urgent
- **Speed**: Clear and measured
- **Quality**: Natural human voice (not robotic)
- **Duration**: ~30 seconds
- **Language**: English

---

## Troubleshooting

### Issue: Button Not Visible

**Solution 1**: Hard refresh (Ctrl + Shift + R)
**Solution 2**: Check if you're logged in
**Solution 3**: Make sure you're on Dashboard page
**Solution 4**: Scroll down - it's below stats cards

### Issue: "No emergency contacts" Error

**Solution**: Go to Settings → Emergency → Add contact first

### Issue: Call Not Received

**Check**:
1. Phone number has country code (+1 for US)
2. Phone number is correct
3. Phone is on and has signal
4. Check Twilio account has credits
5. Check server console for errors

### Issue: AI Voice Not Clear

**This is normal**: ElevenLabs generates high-quality voice
**If garbled**: Check internet connection during generation

---

## Backend API Endpoints

### Test Emergency Call:
```http
POST http://localhost:3001/api/emergency/notify
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "I want to end my life, I cannot go on anymore"
    }
  ]
}
```

### Response:
```json
{
  "success": true,
  "message": "Emergency contacts notified",
  "contactsNotified": 1,
  "results": [
    {
      "contact": "+1234567890",
      "callSuccess": true,
      "smsSuccess": true
    }
  ]
}
```

---

## Manual Test (If Button Still Not Visible)

### Using Browser Console:

1. Open Dashboard
2. Press F12
3. Go to Console tab
4. Paste this code:

```javascript
fetch('http://localhost:3001/api/emergency/notify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'I want to end my life, I cannot go on anymore' }
    ]
  })
})
.then(r => r.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));
```

5. Press Enter
6. Check your phone!

---

## Costs

### Per Test Call:
- ElevenLabs: ~$0.01 (text-to-speech)
- Twilio Call: ~$0.02 (1 minute)
- Twilio SMS: ~$0.01 (1 message)
- **Total**: ~$0.04 per test

### Your Credits:
- Twilio: Check at https://console.twilio.com
- ElevenLabs: Check at https://elevenlabs.io

---

## Production Use

### With Real Tavus Integration:

```
User talks to Tavus AI
    ↓
Conversation analyzed in real-time
    ↓
Crisis detected automatically
    ↓
Emergency contacts called
    ↓
No user action needed!
```

### Automatic Triggers:
- User mentions suicide
- User mentions self-harm
- User expresses hopelessness
- Crisis score ≥ 10

---

## Summary

1. ✅ Add emergency contact in Settings first
2. ✅ Go to Dashboard and scroll down
3. ✅ Click "Test Emergency Call" button
4. ✅ Answer your phone
5. ✅ Hear the AI voice message
6. ✅ System works!

The AI voice will sound like a professional crisis counselor calling to alert the emergency contact about a mental health crisis.

**It's designed to save lives by providing immediate notification when someone is in danger.**
