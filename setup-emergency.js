/**
 * Emergency System Setup Helper
 * Run: node setup-emergency.js
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n🚨 Emergency System Setup\n');
  console.log('This will help you configure Twilio and ElevenLabs for emergency calls.\n');

  try {
    // Get Twilio credentials
    console.log('📞 Twilio Setup');
    console.log('Get these from: https://console.twilio.com/\n');
    
    const twilioSid = await question('Twilio Account SID (starts with AC...): ');
    const twilioToken = await question('Twilio Auth Token: ');
    const twilioPhone = await question('Twilio Phone Number (e.g., +1234567890): ');

    // Get ElevenLabs API key
    console.log('\n🎤 ElevenLabs Setup');
    console.log('Get this from: https://elevenlabs.io/ → Profile → API Keys\n');
    
    const elevenLabsKey = await question('ElevenLabs API Key: ');

    // Read existing .env file
    const envPath = path.join(__dirname, 'server', '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Add or update emergency system variables
    const newVars = `
# Emergency System Configuration (Added by setup-emergency.js)
TWILIO_ACCOUNT_SID=${twilioSid}
TWILIO_AUTH_TOKEN=${twilioToken}
TWILIO_PHONE_NUMBER=${twilioPhone}
ELEVENLABS_API_KEY=${elevenLabsKey}
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
SERVER_URL=http://localhost:3001
`;

    // Remove old emergency config if exists
    envContent = envContent.replace(/# Emergency System Configuration[\s\S]*?(?=\n#|\n$|$)/g, '');
    
    // Append new config
    envContent += newVars;

    // Write back to file
    fs.writeFileSync(envPath, envContent.trim() + '\n');

    console.log('\n✅ Configuration saved to server/.env');
    console.log('\n📋 Next Steps:');
    console.log('1. Install Twilio: cd server && npm install twilio');
    console.log('2. Restart your server: npm run dev');
    console.log('3. Add emergency contacts in Settings → Emergency tab');
    console.log('4. Test the system with: node test-emergency.js');
    console.log('\n🎉 Setup complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setup();
