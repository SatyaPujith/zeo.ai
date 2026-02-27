/**
 * Twilio Service for Emergency Calls
 * Makes automated emergency calls to contacts
 */

const twilio = require('twilio');
const elevenLabs = require('./elevenLabs');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  /**
   * Make emergency call to contact
   * @param {String} toNumber - Contact phone number
   * @param {String} message - Emergency message
   * @param {String} contactName - Contact name
   * @returns {Promise<Object>} Call result
   */
  async makeEmergencyCall(toNumber, message, contactName = '') {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check credentials.');
      }

      // Generate call script
      const callScript = elevenLabs.generateCallScript(message, contactName);

      // Convert to speech
      console.log('Generating speech with ElevenLabs...');
      const audioBuffer = await elevenLabs.textToSpeech(callScript);
      
      // Save audio to temporary file
      const audioFilePath = await elevenLabs.saveAudioToFile(audioBuffer);
      
      // Create TwiML for the call
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Joanna">
            ${callScript}
          </Say>
          <Pause length="2"/>
          <Say voice="Polly.Joanna">
            Press 1 to hear this message again, or hang up to take action.
          </Say>
          <Gather numDigits="1" action="/api/emergency/call-response" method="POST">
            <Pause length="5"/>
          </Gather>
          <Say voice="Polly.Joanna">
            Thank you. Please take immediate action.
          </Say>
        </Response>`;

      // Make the call
      const call = await this.client.calls.create({
        to: toNumber,
        from: this.phoneNumber,
        twiml: twiml,
        statusCallback: `${process.env.SERVER_URL || 'http://localhost:3001'}/api/emergency/call-status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST'
      });

      console.log('Emergency call initiated:', call.sid);

      // Clean up audio file after a delay
      setTimeout(() => {
        elevenLabs.cleanupAudioFile(audioFilePath);
      }, 60000); // 1 minute

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        to: toNumber,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Twilio call error:', error);
      throw error;
    }
  }

  /**
   * Send emergency SMS
   * @param {String} toNumber - Contact phone number
   * @param {String} message - Emergency message
   * @returns {Promise<Object>} SMS result
   */
  async sendEmergencySMS(toNumber, message) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check credentials.');
      }

      const sms = await this.client.messages.create({
        body: `🚨 EMERGENCY ALERT 🚨\n\n${message}\n\nPlease call them immediately or contact emergency services.`,
        to: toNumber,
        from: this.phoneNumber
      });

      console.log('Emergency SMS sent:', sms.sid);

      return {
        success: true,
        messageSid: sms.sid,
        status: sms.status,
        to: toNumber,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }

  /**
   * Make multiple emergency calls
   * @param {Array} contacts - Array of contact objects {phone, name}
   * @param {String} message - Emergency message
   * @returns {Promise<Array>} Results array
   */
  async notifyEmergencyContacts(contacts, message) {
    const results = [];

    for (const contact of contacts) {
      try {
        // Make call
        const callResult = await this.makeEmergencyCall(
          contact.phone,
          message,
          contact.name
        );
        results.push({ ...callResult, type: 'call', contact });

        // Also send SMS as backup
        const smsResult = await this.sendEmergencySMS(
          contact.phone,
          message
        );
        results.push({ ...smsResult, type: 'sms', contact });

        // Wait 2 seconds between contacts to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to notify ${contact.name}:`, error);
        results.push({
          success: false,
          error: error.message,
          contact,
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  /**
   * Get call status
   * @param {String} callSid - Call SID
   * @returns {Promise<Object>} Call status
   */
  async getCallStatus(callSid) {
    try {
      const call = await this.client.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime
      };
    } catch (error) {
      console.error('Error fetching call status:', error);
      throw error;
    }
  }
}

module.exports = new TwilioService();
