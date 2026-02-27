# 🚨 Emergency Crisis Detection & Response System

## Overview

Comprehensive emergency system that detects crisis situations during Tavus conversations and automatically notifies emergency contacts via Twilio calls with ElevenLabs AI voice.

---

## 🎯 Features

### 1. Crisis Detection
- Real-time conversation analysis
- Keyword-based detection for:
  - Suicide ideation
  - Self-harm intentions
  - Severe distress
- Crisis level scoring (none, low, medium, high, critical)
- Automatic flagging of high-risk conversations

### 2. Emergency Notification
- Automated phone calls to emergency contacts
- AI-generated voice messages using ElevenLabs
- SMS backup notifications
- Multiple contact support
- Call status tracking

### 3. Safety Features
- Immediate intervention for critical cases
- Crisis resource information
- Session logging with crisis flags
- Emergency contact management

---

## 📋 Prerequisites

### 1. Twilio Account
1. Sign up at [https://www.twilio.com/](https://www.twilio.com/)
2. Get a phone number with voice capabilities
3. Note your Account SID and Auth Token

### 2. ElevenLabs Account
1. Sign up at [https://elevenlabs.io/](https://elevenlabs.io/)
2. Get your API key
3. Choose a voice ID (default: Sarah - EXAVITQu4vr4xnSDxMaL)

---

## 🚀 Installation

### 1. Install Dependencies

```bash
cd server
npm install twilio
```

### 2. Configure Environment Variables

Add to `server/.env`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Server URL (for Twilio callbacks)
SERVER_URL=http://localhost:3001
```

### 3. Create Temp Directory

```bash
mkdir server/temp
```

---

## 🔧 How It Works

### Flow Diagram

```
User Conversation (Tavus)
         ↓
Crisis Detection Service
    (Analyzes messages)
         ↓
    Crisis Score ≥ 10?
         ↓ YES
Generate Crisis Summary
         ↓
ElevenLabs TTS
    (Convert to speech)
         ↓
Twilio Service
    (Make calls + SMS)
         ↓
Emergency Contacts Notified
```

### Crisis Detection Algorithm

```javascript
// Keyword Categories
Suicide Keywords: +10 points each
Self-Harm Keywords: +7 points each
Severe Distress: +3 points each

// Crisis Levels
Score ≥ 10: CRITICAL (immediate intervention)
Score 7-9: HIGH (urgent attention)
Score 4-6: MEDIUM (monitoring needed)
Score 2-3: LOW (mild concern)
Score < 2: NONE
```

---

## 📡 API Endpoints

### Analyze Session for Crisis
```http
POST /api/emergency/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session_id",
  "messages": [
    { "role": "user", "content": "I can't go on..." },
    { "role": "assistant", "content": "I'm here to help..." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "isCrisis": true,
    "crisisLevel": "critical",
    "crisisScore": 13,
    "detectedKeywords": ["can't go on", "end my life"],
    "requiresIntervention": true,
    "timestamp": "2026-02-27T..."
  }
}
```

### Notify Emergency Contacts
```http
POST /api/emergency/notify
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session_id",
  "messages": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency contacts notified",
  "contactsNotified": 2,
  "results": [
    {
      "success": true,
      "callSid": "CAxxxx",
      "type": "call",
      "contact": { "name": "John", "phone": "+1234567890" }
    },
    {
      "success": true,
      "messageSid": "SMxxxx",
      "type": "sms",
      "contact": { "name": "John", "phone": "+1234567890" }
    }
  ]
}
```

### Get Crisis Resources
```http
GET /api/emergency/resources
```

**Response:**
```json
{
  "success": true,
  "resources": {
    "us": {
      "suicide": "988",
      "crisis": "1-800-273-8255",
      "text": "Text HOME to 741741"
    }
  },
  "message": "If you are in crisis, please call 988..."
}
```

### Test Emergency System
```http
POST /api/emergency/test
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "contactName": "Test Contact"
}
```

---

## 💾 Database Schema Updates

### User Model - Emergency Contacts
```javascript
emergencyContacts: [{
  name: String (required),
  phone: String (required),
  relationship: String,
  isPrimary: Boolean
}]
```

### Session Model - Crisis Tracking
```javascript
crisisDetected: Boolean,
crisisLevel: String (enum),
crisisTimestamp: Date,
emergencyNotified: Boolean,
emergencyNotificationTime: Date,
emergencyNotificationResults: Array
```

---

## 🎤 ElevenLabs Voice Script

The AI voice says:

```
Hello [Contact Name]. This is an urgent automated message from ZEO AI Mental Health Support.

[Crisis Summary with detected indicators and recent conversation context]

Please try to contact them immediately. If you cannot reach them or believe they are in immediate danger, please call emergency services at 911 or your local emergency number.

If you need additional support, you can contact the National Suicide Prevention Lifeline at 988 or 1-800-273-8255.

This is an automated emergency alert. Please take immediate action. Thank you.

Press 1 to hear this message again, or hang up to take action.
```

---

## 🔐 Security & Privacy

### Data Protection
- Crisis data encrypted in database
- Emergency contacts stored securely
- Call recordings not stored
- HIPAA-compliant practices

### Access Control
- Only authenticated users can trigger analysis
- Emergency contacts managed by user
- Admin-only test endpoints
- Rate limiting on notifications

### Ethical Considerations
- False positive handling
- User consent for emergency contacts
- Clear crisis resource information
- Professional mental health referrals

---

## 🧪 Testing

### 1. Test Crisis Detection

```javascript
// Test messages
const testMessages = [
  { role: 'user', content: 'I want to end my life' },
  { role: 'assistant', content: 'I\'m here to help...' }
];

// Analyze
POST /api/emergency/analyze
Body: { messages: testMessages }

// Expected: crisisLevel = "critical", score ≥ 10
```

### 2. Test Emergency Notification

```bash
# Add test emergency contact to user
# Then trigger notification
POST /api/emergency/notify
Body: { sessionId: "test", messages: testMessages }

# Check: Call and SMS received
```

### 3. Test Twilio Integration

```bash
POST /api/emergency/test
Body: { phoneNumber: "+1234567890", contactName: "Test" }

# Check: SMS received with test message
```

---

## 📱 Frontend Integration

### Add Emergency Contacts in Settings

```typescript
// In Settings.tsx, add emergency contacts section
const [emergencyContacts, setEmergencyContacts] = useState([]);

const addEmergencyContact = async (contact) => {
  await updateUser({
    emergencyContacts: [...emergencyContacts, contact]
  });
};
```

### Monitor Session for Crisis

```typescript
// In Session.tsx, periodically analyze conversation
useEffect(() => {
  const interval = setInterval(async () => {
    if (messages.length > 0) {
      const response = await fetch('/api/emergency/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, messages })
      });
      
      const { analysis } = await response.json();
      
      if (analysis.requiresIntervention) {
        // Trigger emergency notification
        await fetch('/api/emergency/notify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId, messages })
        });
      }
    }
  }, 30000); // Check every 30 seconds
  
  return () => clearInterval(interval);
}, [messages]);
```

---

## 🎯 Crisis Keywords

### Suicide Indicators (Critical - 10 points)
- "kill myself"
- "end my life"
- "want to die"
- "suicide"
- "suicidal"
- "not worth living"
- "better off dead"
- "end it all"
- "take my life"
- "no reason to live"

### Self-Harm Indicators (High - 7 points)
- "hurt myself"
- "cut myself"
- "self harm"
- "injure myself"
- "pain myself"

### Severe Distress (Medium - 3 points)
- "can't go on"
- "give up"
- "no hope"
- "hopeless"
- "worthless"
- "burden to everyone"
- "can't take it anymore"

---

## 📞 Emergency Resources

### United States
- **988 Suicide & Crisis Lifeline**: 988
- **National Suicide Prevention Lifeline**: 1-800-273-8255
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

### International
- **International Association for Suicide Prevention**: [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/)

---

## 🔄 Workflow Example

### Scenario: User in Crisis

1. **User starts Tavus conversation**
   - Expresses suicidal thoughts
   - "I can't go on anymore, I want to end it all"

2. **System detects crisis**
   - Crisis score: 13 (CRITICAL)
   - Keywords: "can't go on", "end it all"
   - Requires intervention: YES

3. **Emergency notification triggered**
   - Generates crisis summary
   - Converts to speech with ElevenLabs
   - Calls emergency contact #1
   - Sends backup SMS
   - Calls emergency contact #2
   - Sends backup SMS

4. **Emergency contact receives call**
   - Hears AI voice message
   - Gets crisis details
   - Receives action instructions
   - Can press 1 to repeat

5. **Session logged**
   - Crisis flag set
   - Notification results saved
   - Timestamp recorded

---

## ⚠️ Important Notes

### Legal Considerations
- This is NOT a replacement for professional mental health services
- Users should be informed about crisis detection
- Emergency contacts must consent to receive alerts
- Comply with local healthcare regulations

### Limitations
- Keyword-based detection may have false positives/negatives
- Requires active emergency contacts
- Depends on Twilio/ElevenLabs availability
- Not suitable as sole crisis intervention

### Best Practices
- Always provide crisis hotline numbers
- Encourage professional help
- Regular system testing
- Monitor false positive rates
- Update keyword lists based on feedback

---

## 🚀 Deployment

### Production Checklist

- [ ] Twilio account verified and funded
- [ ] ElevenLabs API key active
- [ ] Environment variables set
- [ ] Temp directory created
- [ ] Emergency routes tested
- [ ] Crisis keywords reviewed
- [ ] Legal compliance verified
- [ ] User consent obtained
- [ ] Monitoring system in place
- [ ] Backup notification method
- [ ] Crisis resources updated
- [ ] Staff training completed

### Monitoring

```javascript
// Track metrics
- Crisis detection rate
- False positive rate
- Emergency notification success rate
- Average response time
- Call completion rate
- SMS delivery rate
```

---

## 📊 Analytics

### Key Metrics to Track

1. **Detection Metrics**
   - Total crises detected
   - Crisis level distribution
   - False positive rate
   - Detection accuracy

2. **Notification Metrics**
   - Calls made
   - Calls answered
   - SMS delivered
   - Average call duration

3. **Response Metrics**
   - Time to notification
   - Contact response rate
   - Intervention outcomes

---

## 🆘 Support

### If Emergency System Fails

1. **Fallback Options**
   - Display crisis hotline numbers in UI
   - Email notification to admin
   - In-app emergency button
   - Direct 911 call prompt

2. **Troubleshooting**
   - Check Twilio credentials
   - Verify ElevenLabs API key
   - Test phone number format
   - Review server logs
   - Check network connectivity

---

**Status:** ✅ READY FOR IMPLEMENTATION

**Last Updated:** February 27, 2026

**Built with ❤️ by Team KANYARASHI**

**Remember: This system saves lives. Test thoroughly and monitor continuously.**
