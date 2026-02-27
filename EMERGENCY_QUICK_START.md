# 🚨 Emergency System - Quick Start (5 Minutes)

## What This Does

When a user talks to your Tavus AI and mentions suicide/self-harm:
1. **AI detects crisis** automatically
2. **Calls emergency contact** with AI voice (ElevenLabs)
3. **Tells them**: "Your friend needs help urgently"
4. **Sends SMS backup** with details

---

## Setup (Follow These Steps)

### Step 1: Get Your Credentials (3 minutes)

#### A. Twilio (Phone Calls)
1. Go to: https://console.twilio.com/
2. Copy these 3 things:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click eye icon to reveal)
   - **Phone Number** (buy one if needed, ~$1/month)

#### B. ElevenLabs (AI Voice)
1. Go to: https://elevenlabs.io/
2. Go to: Profile → API Keys
3. Copy your **API Key**

---

### Step 2: Run Setup Script (1 minute)

```bash
# In your project root
node setup-emergency.js
```

It will ask you to paste:
- Twilio Account SID
- Twilio Auth Token
- Twilio Phone Number
- ElevenLabs API Key

**Done!** It saves everything to `server/.env`

---

### Step 3: Install & Restart (1 minute)

```bash
cd server
npm install twilio
npm run dev
```

---

### Step 4: Add Emergency Contact

**Option A: Use the UI (Recommended)**
1. Login to your app
2. Go to Settings → Emergency tab
3. Add contact name and phone number
4. Click Save

**Option B: Use API**
```bash
# Get your token after login, then:
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

---

### Step 5: Test It!

```bash
node test-emergency.js
```

Enter your login credentials and a test phone number.
You'll receive a call and SMS!

---

## How It Works Automatically

### In Your Tavus Conversation:

**User says:** "I want to end my life"

**System automatically:**
1. ✅ Detects crisis (score: 10+)
2. ✅ Calls emergency contact
3. ✅ AI voice says: "Urgent: Your friend [Name] is in distress..."
4. ✅ Sends SMS backup
5. ✅ Logs everything

**No manual intervention needed!**

---

## Crisis Words That Trigger Alert

High Priority (Immediate Call):
- "kill myself"
- "end my life"
- "want to die"
- "suicide"
- "better off dead"

Medium Priority (Monitored):
- "can't go on"
- "no hope"
- "give up"
- "worthless"

---

## What Emergency Contact Hears

**Phone Call (AI Voice):**
> "Hello John. This is an urgent automated message from ZEO AI Mental Health Support.
> 
> Your friend Sarah is showing signs of severe distress. They mentioned wanting to end their life and feeling hopeless.
> 
> Please contact them immediately at [phone number].
> 
> If you cannot reach them, call 911 or emergency services.
> 
> For crisis support, call 988 Suicide Prevention Lifeline.
> 
> Press 1 to hear this message again."

**SMS (Text Message):**
> 🚨 EMERGENCY ALERT
> 
> Your friend Sarah needs urgent help. They are showing signs of severe distress in their conversation.
> 
> Please call them immediately or contact emergency services.
> 
> Crisis hotline: 988

---

## Integration with Tavus

The system monitors your Tavus conversations in real-time:

```javascript
// Automatically checks every 30 seconds during conversation
// If crisis detected → immediate notification
// No user action needed
```

---

## Troubleshooting

### "Twilio error: Authentication failed"
- Check Account SID and Auth Token are correct
- Make sure no extra spaces

### "Phone number invalid"
- Use format: +1234567890 (include country code)
- No spaces or dashes

### "ElevenLabs error"
- Check API key is correct
- Make sure you have credits in your account

### "No emergency contacts"
- Add at least one contact in Settings
- Or use the API to add contacts

---

## Test Without Real Call

```bash
# Just test crisis detection (no call)
curl -X POST http://localhost:3001/api/emergency/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "I want to end my life"}
    ]
  }'
```

Response will show if crisis was detected.

---

## Production Checklist

Before going live:

- [ ] Twilio account verified and funded
- [ ] ElevenLabs API key active
- [ ] Test call successful
- [ ] Emergency contacts added
- [ ] Crisis detection tested
- [ ] Users informed about feature
- [ ] Legal compliance checked

---

## Cost Estimate

- **Twilio Phone Number**: ~$1/month
- **Twilio Calls**: ~$0.02/minute
- **Twilio SMS**: ~$0.0075/message
- **ElevenLabs**: Free tier available

**Example:** 10 emergency calls/month = ~$2-3 total

---

## Support

### If you need help:

1. **Check logs**: `server/` folder
2. **Test system**: `node test-emergency.js`
3. **Verify credentials**: Check `server/.env`

### Crisis Resources (Always Available):

- **988**: Suicide & Crisis Lifeline
- **911**: Emergency Services
- **741741**: Crisis Text Line (text HOME)

---

## What You Gave Me

Just provide these and I'll set it up:

```
Twilio Account SID: ________________
Twilio Auth Token: ________________
Twilio Phone Number: ________________
ElevenLabs API Key: ________________
```

Paste them when you run: `node setup-emergency.js`

---

**That's it! Your emergency system is ready to save lives.** 🎉

**Questions? Just ask!**
