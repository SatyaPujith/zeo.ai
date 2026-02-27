/**
 * Test script to verify authentication setup
 * Run: node test-auth-setup.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

let testToken = '';
let testUserId = '';

async function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealthCheck() {
  try {
    log('\n📡 Testing Health Check...', 'blue');
    const response = await axios.get(`${API_URL}/health`);
    log(`✅ Health check passed: ${response.data.status}`, 'green');
    log(`   Database: ${response.data.database}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function testRegister() {
  try {
    log('\n👤 Testing User Registration...', 'blue');
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    if (response.data.success && response.data.token) {
      testToken = response.data.token;
      testUserId = response.data.user.id;
      log('✅ Registration successful', 'green');
      log(`   User ID: ${testUserId}`, 'green');
      log(`   Name: ${response.data.user.name}`, 'green');
      log(`   Email: ${response.data.user.email}`, 'green');
      log(`   Token: ${testToken.substring(0, 20)}...`, 'green');
      return true;
    }
    
    log('❌ Registration failed: No token received', 'red');
    return false;
  } catch (error) {
    log(`❌ Registration failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testGetMe() {
  try {
    log('\n🔍 Testing Get Current User...', 'blue');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success && response.data.user) {
      log('✅ Get current user successful', 'green');
      log(`   Name: ${response.data.user.name}`, 'green');
      log(`   Email: ${response.data.user.email}`, 'green');
      log(`   Subscription: ${response.data.user.subscription.plan}`, 'green');
      log(`   Sessions: ${response.data.user.subscription.sessionsUsed}/${response.data.user.subscription.sessionsLimit}`, 'green');
      return true;
    }
    
    log('❌ Get current user failed', 'red');
    return false;
  } catch (error) {
    log(`❌ Get current user failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testCreateSession() {
  try {
    log('\n📝 Testing Create Session...', 'blue');
    const sessionData = {
      conversationId: `conv_${Date.now()}`,
      replicaId: 'r9fa0878977a',
      personaId: 'p0c7d07b7e09'
    };
    
    const response = await axios.post(`${API_URL}/sessions`, sessionData, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success && response.data.session) {
      log('✅ Session creation successful', 'green');
      log(`   Session ID: ${response.data.session._id}`, 'green');
      log(`   Conversation ID: ${response.data.session.conversationId}`, 'green');
      log(`   Status: ${response.data.session.status}`, 'green');
      return response.data.session._id;
    }
    
    log('❌ Session creation failed', 'red');
    return null;
  } catch (error) {
    log(`❌ Session creation failed: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testGetSessions() {
  try {
    log('\n📋 Testing Get Sessions...', 'blue');
    const response = await axios.get(`${API_URL}/sessions`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success) {
      log('✅ Get sessions successful', 'green');
      log(`   Total sessions: ${response.data.count}`, 'green');
      log(`   Sessions returned: ${response.data.sessions.length}`, 'green');
      return true;
    }
    
    log('❌ Get sessions failed', 'red');
    return false;
  } catch (error) {
    log(`❌ Get sessions failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testUpdateSession(sessionId) {
  try {
    log('\n✏️ Testing Update Session...', 'blue');
    const updateData = {
      emotionData: {
        emotions: {
          happiness: 0.8,
          sadness: 0.1,
          anger: 0.05,
          fear: 0.02,
          surprise: 0.02,
          disgust: 0.01,
          neutral: 0.0
        },
        dominantEmotion: 'happiness',
        confidence: 0.85
      },
      message: {
        role: 'user',
        content: 'Test message',
        emotion: 'happiness'
      },
      duration: 120,
      status: 'active'
    };
    
    const response = await axios.put(`${API_URL}/sessions/${sessionId}`, updateData, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success) {
      log('✅ Session update successful', 'green');
      log(`   Duration: ${response.data.session.duration}s`, 'green');
      log(`   Messages: ${response.data.session.messages.length}`, 'green');
      log(`   Emotion data entries: ${response.data.session.emotionData.length}`, 'green');
      return true;
    }
    
    log('❌ Session update failed', 'red');
    return false;
  } catch (error) {
    log(`❌ Session update failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testGetAnalytics() {
  try {
    log('\n📊 Testing Get Analytics...', 'blue');
    const response = await axios.get(`${API_URL}/sessions/analytics`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success) {
      log('✅ Get analytics successful', 'green');
      log(`   Total sessions: ${response.data.analytics.totalSessions}`, 'green');
      log(`   Total duration: ${response.data.analytics.totalDuration}s`, 'green');
      log(`   Average duration: ${response.data.analytics.averageDuration}s`, 'green');
      return true;
    }
    
    log('❌ Get analytics failed', 'red');
    return false;
  } catch (error) {
    log(`❌ Get analytics failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testLogout() {
  try {
    log('\n🚪 Testing Logout...', 'blue');
    const response = await axios.get(`${API_URL}/auth/logout`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    
    if (response.data.success) {
      log('✅ Logout successful', 'green');
      return true;
    }
    
    log('❌ Logout failed', 'red');
    return false;
  } catch (error) {
    log(`❌ Logout failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'yellow');
  log('🧪 ZEO.AI Authentication & Session Testing', 'yellow');
  log('='.repeat(60), 'yellow');
  
  log('\n⚠️  Make sure the server is running on http://localhost:3001', 'yellow');
  log('   Run: cd server && npm run dev\n', 'yellow');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results = {
    passed: 0,
    failed: 0
  };
  
  // Test 1: Health Check
  if (await testHealthCheck()) results.passed++;
  else { results.failed++; return printResults(results); }
  
  // Test 2: Register
  if (await testRegister()) results.passed++;
  else { results.failed++; return printResults(results); }
  
  // Test 3: Get Me
  if (await testGetMe()) results.passed++;
  else results.failed++;
  
  // Test 4: Create Session
  const sessionId = await testCreateSession();
  if (sessionId) results.passed++;
  else results.failed++;
  
  // Test 5: Get Sessions
  if (await testGetSessions()) results.passed++;
  else results.failed++;
  
  // Test 6: Update Session
  if (sessionId) {
    if (await testUpdateSession(sessionId)) results.passed++;
    else results.failed++;
  }
  
  // Test 7: Get Analytics
  if (await testGetAnalytics()) results.passed++;
  else results.failed++;
  
  // Test 8: Logout
  if (await testLogout()) results.passed++;
  else results.failed++;
  
  printResults(results);
}

function printResults(results) {
  log('\n' + '='.repeat(60), 'yellow');
  log('📊 Test Results', 'yellow');
  log('='.repeat(60), 'yellow');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`, 'blue');
  log('='.repeat(60) + '\n', 'yellow');
  
  if (results.failed === 0) {
    log('🎉 All tests passed! Your authentication system is working correctly.', 'green');
    log('📝 Next steps:', 'blue');
    log('   1. Create frontend login/register UI', 'blue');
    log('   2. Integrate with existing Tavus functionality', 'blue');
    log('   3. Test session tracking with real conversations', 'blue');
  } else {
    log('⚠️  Some tests failed. Please check the errors above.', 'yellow');
    log('💡 Common issues:', 'blue');
    log('   - Server not running (run: cd server && npm run dev)', 'blue');
    log('   - MongoDB not connected (check MONGODB_URI in .env)', 'blue');
    log('   - Missing environment variables (check .env file)', 'blue');
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
