const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
  ? authHeader.slice(7).trim()
  : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = {
      user_id: payload.user_id,
      role: payload.role,
      user_class: payload.user_class,
      grade_scope: payload.grade_scope
    };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
