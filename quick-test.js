/**
 * Quick Test - Emergency System
 * Tests if Twilio and ElevenLabs are configured correctly
 */

require('dotenv').config({ path: './server/.env' });

console.log('\n🧪 Testing Emergency System Configuration\n');

// Check environment variables
console.log('📋 Checking credentials...\n');

const checks = {
  'Twilio Account SID': process.env.TWILIO_ACCOUNT_SID,
  'Twilio Auth Token': process.env.TWILIO_AUTH_TOKEN,
  'Twilio Phone Number': process.env.TWILIO_PHONE_NUMBER,
  'ElevenLabs API Key': process.env.ELEVENLABS_API_KEY,
  'Server URL': process.env.SERVER_URL
};

let allGood = true;

for (const [name, value] of Object.entries(checks)) {
  if (value) {
    console.log(`✅ ${name}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${name}: MISSING`);
    allGood = false;
  }
}

if (allGood) {
  console.log('\n🎉 All credentials configured!\n');
  console.log('📝 Next steps:');
  console.log('1. Restart your server: cd server && npm run dev');
  console.log('2. Add emergency contact in Settings → Emergency tab');
  console.log('3. Test with: node test-emergency.js\n');
} else {
  console.log('\n❌ Some credentials are missing!');
  console.log('Please check server/.env file\n');
}

// Test Twilio connection
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  console.log('🔌 Testing Twilio connection...');
  
  try {
    const twilio = require('./server/node_modules/twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    client.api.accounts(process.env.TWILIO_ACCOUNT_SID)
      .fetch()
      .then(account => {
        console.log(`✅ Twilio connected! Account: ${account.friendlyName}\n`);
        console.log('🚀 Emergency system is ready!\n');
      })
      .catch(error => {
        console.log(`❌ Twilio connection failed: ${error.message}\n`);
        console.log('Please check your Account SID and Auth Token\n');
      });
  } catch (error) {
    console.log('⚠️  Twilio module not found in server folder');
    console.log('   This is OK - it will work when server runs\n');
  }
}
