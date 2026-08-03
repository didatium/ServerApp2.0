const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = jwt.verify(token, jwtSecret);
    // payload expected to contain user_id and role
    req.user = { user_id: payload.user_id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
