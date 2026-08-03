require('dotenv').config();

module.exports = {
  // Database
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 20,
    waitForConnections: true,
    queueLimit: 0
  },
  
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret'
};