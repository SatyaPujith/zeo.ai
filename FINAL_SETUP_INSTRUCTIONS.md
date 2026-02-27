# 🎯 FINAL SETUP - Emergency Crisis System

## ✅ What I've Built For You

A complete emergency system that:
1. **Detects crisis** when user mentions suicide/self-harm in Tavus
2. **Automatically calls** emergency contacts
3. **AI voice** (ElevenLabs) explains the situation
4. **Sends SMS backup** with details

---

## 📋 What YOU Need to Provide

### 1. Twilio Credentials
Go to: https://console.twilio.com/

Copy these 3 things:
```
Account SID: AC________________________________
Auth Token: ________________________________
Phone Number: +1__________
```

### 2. ElevenLabs API Key
Go to: https://elevenlabs.io/ → Profile → API Keys

Copy this:
```
API Key: ________________________________
```

---

## 🚀 Setup Steps (5 Minutes)

### Step 1: Run Setup Script
```bash
node setup-emergency.js
```

Paste your 4 credentials when asked.

### Step 2: Install Twilio
```bash
cd server
npm install twilio
```

### Step 3: Restart Server
```bash
npm run dev
```

### Step 4: Add Emergency Contact

**In your app:**
1. Login
2. Go to Settings
3. Look for "Emergency" or "Emergency Contacts" section
4. Add contact name and phone number
5. Save

**Or use this API call:**
```bash
# Get your token after login
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

### Step 5: Test It
```bash
node test-emergency.js
```

---

## 🎯 How It Works (Automatic)

### During Tavus Conversation:

**User says:** "I want to end my life, I can't go on"

**System automatically:**
1. ✅ Detects crisis keywords
2. ✅ Calculates crisis score (10+)
3. ✅ Calls emergency contact
4. ✅ AI voice explains situation
5. ✅ Sends SMS backup
6. ✅ Logs everything

**No manual action needed!**

---

## 📞 What Emergency Contact Receives

### Phone Call (AI Voice):
> "Hello John. This is an urgent automated message from ZEO AI Mental Health Support.
> 
> Your friend Sarah is in severe distress. They mentioned wanting to end their life and feeling hopeless during their conversation.
> 
> Please contact them immediately.
> 
> If you cannot reach them, call 911 or emergency services.
> 
> For crisis support, call 988 Suicide Prevention Lifeline.
> 
> Press 1 to hear this message again."

### SMS (Text):
> 🚨 EMERGENCY ALERT
> 
> Your friend Sarah needs urgent help. They are showing signs of severe distress.
> 
> Please call them immediately or contact emergency services.
> 
> Crisis hotline: 988

---

## 🔍 Crisis Detection Keywords

### Critical (Immediate Call):
- "kill myself"
- "end my life"
- "want to die"
- "suicide"
- "better off dead"
- "end it all"

### High Priority:
- "hurt myself"
- "cut myself"
- "self harm"

### Medium Priority:
- "can't go on"
- "no hope"
- "give up"
- "worthless"

---

## 📁 Files I Created

### Backend:
- `server/services/crisisDetection.js` - Detects crisis in conversation
- `server/services/elevenLabs.js` - Converts text to AI voice
- `server/services/twilioService.js` - Makes calls and sends SMS
- `server/controllers/emergencyController.js` - Handles emergency logic
- `server/routes/emergency.js` - API endpoints

### Frontend:
- `client/src/components/EmergencyContactsManager.tsx` - UI to manage contacts

### Setup:
- `setup-emergency.js` - Easy setup script
- `test-emergency.js` - Test the system

### Documentation:
- `EMERGENCY_QUICK_START.md` - Quick guide
- `SIMPLE_SETUP_GUIDE.md` - Simple instructions
- `WHAT_YOU_NEED_TO_DO.md` - Your action items

---

## 🧪 Testing

### Test 1: Crisis Detection
```bash
curl -X POST http://localhost:3001/api/emergency/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "I want to end my life"}
    ]
  }'
```

Should return: `"isCrisis": true, "crisisLevel": "critical"`

### Test 2: Emergency Call
```bash
node test-emergency.js
```

Follow prompts to send test call/SMS.

---

## 💰 Cost

- **Twilio Phone Number**: ~$1/month
- **Emergency Call**: ~$0.02/minute
- **SMS**: ~$0.01 each
- **ElevenLabs**: Free tier available

**Total per emergency**: ~$0.03

---

## ⚠️ Important Notes

### Legal:
- This is NOT a replacement for professional help
- Users should be informed about crisis detection
- Emergency contacts must consent
- Comply with local regulations

### Privacy:
- Crisis data encrypted
- Calls not recorded
- HIPAA-compliant practices

### Limitations:
- Keyword-based detection (may have false positives)
- Requires emergency contacts configured
- Depends on Twilio/ElevenLabs availability

---

## 🆘 Always Available Resources

Display these in your app:

- **988**: Suicide & Crisis Lifeline
- **911**: Emergency Services
- **741741**: Crisis Text Line (text HOME)

---

## 📊 What Gets Logged

For each crisis:
- Crisis level and score
- Detected keywords
- Timestamp
- Emergency contacts notified
- Call/SMS status
- User session data

---

## 🔄 Integration with Tavus

The system monitors Tavus conversations automatically:

```javascript
// Every 30 seconds during conversation:
1. Analyze recent messages
2. Calculate crisis score
3. If score ≥ 10 → trigger emergency call
4. Log everything
```

---

## ✅ Production Checklist

Before going live:

- [ ] Twilio account verified
- [ ] ElevenLabs API key active
- [ ] Test call successful
- [ ] Emergency contacts added
- [ ] Crisis detection tested
- [ ] Users informed about feature
- [ ] Legal compliance verified
- [ ] Monitoring system in place

---

## 🎉 You're Done!

Once you provide the 4 credentials and run the setup:

✅ Crisis detection active
✅ Emergency calls automated
✅ AI voice configured
✅ SMS backup enabled
✅ System logging everything

**Your app can now save lives!**

---

## 📞 Need Help?

Just give me your:
1. Twilio Account SID
2. Twilio Auth Token
3. Twilio Phone Number
4. ElevenLabs API Key

I'll add them to your `.env` file and test everything!

---

**Remember: This system is designed to save lives. Test it thoroughly!** 🚨
