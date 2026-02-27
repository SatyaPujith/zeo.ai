/**
 * ElevenLabs Text-to-Speech Service
 * Converts crisis summary to natural speech
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.apiUrl = 'https://api.elevenlabs.io/v1';
    // Use a calm, professional voice for emergency calls
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Default: Sarah voice
  }

  /**
   * Convert text to speech
   * @param {String} text - Text to convert
   * @returns {Promise<Buffer>} Audio buffer
   */
  async textToSpeech(text) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/text-to-speech/${this.voiceId}`,
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error.response?.data || error.message);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Generate emergency call script
   * @param {String} summary - Crisis summary
   * @param {String} contactName - Emergency contact name
   * @returns {String} Call script
   */
  generateCallScript(summary, contactName) {
    return `Hello ${contactName || 'there'}. This is an urgent automated message from ZEO AI Mental Health Support. 
    
    ${summary}
    
    Please try to contact them immediately. If you cannot reach them or believe they are in immediate danger, please call emergency services at 911 or your local emergency number.
    
    If you need additional support, you can contact the National Suicide Prevention Lifeline at 988 or 1-800-273-8255.
    
    This is an automated emergency alert. Please take immediate action. Thank you.`;
  }

  /**
   * Save audio to temporary file
   * @param {Buffer} audioBuffer - Audio data
   * @returns {Promise<String>} File path
   */
  async saveAudioToFile(audioBuffer) {
    const tempDir = path.join(__dirname, '../temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `emergency-call-${Date.now()}.mp3`;
    const filePath = path.join(tempDir, fileName);

    await fs.promises.writeFile(filePath, audioBuffer);
    
    return filePath;
  }

  /**
   * Clean up temporary audio file
   * @param {String} filePath - Path to file
   */
  async cleanupAudioFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error cleaning up audio file:', error);
    }
  }
}

module.exports = new ElevenLabsService();
