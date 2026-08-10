const mysql = require('mysql2/promise');
const { db } = require('../config/environment');

if (!db.host || !db.user || !db.password || !db.database) {
  throw new Error('Database configuration is incomplete. Please check your environment variables.');
}

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  port: db.port,
  waitForConnections: db.waitForConnections,
  connectionLimit: db.connectionLimit,
  queueLimit: db.queueLimit,
  ssl: { rejectUnauthorized: false }
});

async function query(sql, params = []) {
  const formattedParams = Array.isArray(params) ? params : [params];

  const [rows] = await pool.query(sql, formattedParams);
  return rows;
}

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
