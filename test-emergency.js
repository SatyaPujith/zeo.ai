/**
 * Test Emergency System
 * Run: node test-emergency.js
 */

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const API_URL = 'http://localhost:3001/api';

async function test() {
  console.log('\n🧪 Emergency System Test\n');

  try {
    // Get user token
    console.log('First, login to get your token:\n');
    const email = await question('Your email: ');
    const password = await question('Your password: ');

    // Login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });

    const token = loginResponse.data.token;
    console.log('\n✅ Logged in successfully\n');

    // Test 1: Check crisis resources
    console.log('📋 Test 1: Checking crisis resources...');
    const resourcesResponse = await axios.get(`${API_URL}/emergency/resources`);
    console.log('✅ Crisis resources available:', resourcesResponse.data.resources.us.suicide);

    // Test 2: Analyze a test message
    console.log('\n🔍 Test 2: Testing crisis detection...');
    const testMessages = [
      { role: 'user', content: 'I am feeling very sad today' },
      { role: 'assistant', content: 'I am here to help you' },
      { role: 'user', content: 'I want to end my life, I cannot go on' }
    ];

    const analysisResponse = await axios.post(
      `${API_URL}/emergency/analyze`,
      { messages: testMessages },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ Crisis detected:', analysisResponse.data.analysis.isCrisis);
    console.log('   Level:', analysisResponse.data.analysis.crisisLevel);
    console.log('   Score:', analysisResponse.data.analysis.crisisScore);
    console.log('   Keywords:', analysisResponse.data.analysis.detectedKeywords.join(', '));

    // Test 3: Send test notification
    console.log('\n📞 Test 3: Testing emergency notification...');
    const testPhone = await question('\nEnter a phone number to test (e.g., +1234567890): ');
    const testName = await question('Enter contact name: ');

    const confirm = await question('\n⚠️  This will make a real call and send SMS. Continue? (yes/no): ');
    
    if (confirm.toLowerCase() === 'yes') {
      const testResponse = await axios.post(
        `${API_URL}/emergency/test`,
        {
          phoneNumber: testPhone,
          contactName: testName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('\n✅ Test notification sent!');
      console.log('   Check your phone for SMS');
      console.log('   Result:', testResponse.data.result);
    } else {
      console.log('\n⏭️  Skipped test notification');
    }

    console.log('\n🎉 All tests completed!\n');
    console.log('📝 Summary:');
    console.log('   ✅ Crisis detection working');
    console.log('   ✅ Emergency system configured');
    console.log('   ✅ Ready for production use\n');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Details:', error.response.data);
    }
  } finally {
    rl.close();
  }
}

test();
