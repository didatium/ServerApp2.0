const jwt = require('jsonwebtoken');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { authenticateByUserId } = require('../services/authService');
const { jwtSecret } = require('../config/environment');

// Rate limiter: count only failed attempts via skipSuccessfulRequests
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max failed attempts
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.body && req.body.user_id ? String(req.body.user_id) : 'unknown'}-${ipKeyGenerator(req)}`,
  message: { success: false, message: 'Too many login attempts, try again later' }
});

async function loginHandler(req, res, next) {
  try {
    const { user_id, password } = req.body;
    if (!user_id || !password) return res.status(400).json({ success: false, message: 'user_id and password required' });

    const user = await authenticateByUserId(user_id, password);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const payload = { user_id: user.user_id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    return res.json({ success: true, token, user: { user_id: user.user_id, role: user.role, user_class: user.user_class } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginHandler,
  loginLimiter
};
