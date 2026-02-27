require('dotenv').config();

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/zeo-ai',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 7,
  
  // Tavus API Configuration
  tavusApiKey: process.env.TAVUS_API_KEY || '5f50263c80654c5bb8613a0e7a90f029',
  tavusApiUrl: process.env.TAVUS_API_URL || 'https://tavusapi.com/v2',
  replicaId: process.env.TAVUS_REPLICA_ID || 'r6ae5b6efc9d',
  defaultPersonaId: process.env.TAVUS_DEFAULT_PERSONA_ID || '',
  
  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8081'
};
