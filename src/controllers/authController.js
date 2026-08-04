const jwt = require('jsonwebtoken');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { authenticateByUserName } = require('../services/authService');
const { jwtSecret } = require('../config/environment');

// Rate limiter: count only failed attempts via skipSuccessfulRequests
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max failed attempts
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.body && req.body.user_name ? String(req.body.user_name) : 'unknown'}-${ipKeyGenerator(req)}`,
  message: { success: false, message: 'Too many login attempts, try again later' }
});

async function loginHandler(req, res, next) {
  try {
    const { user_name, password } = req.body;
    if (!user_name || !password) return res.status(400).json({ success: false, message: 'user_name and password required' });

    const user = await authenticateByUserName(user_name, password);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const payload = {
      user_id: user.user_id,
      user_name: user.user_name,
      role: user.role,
      user_class: user.user_class,
      grade_scope: user.grade_scope
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        role: user.role,
        user_class: user.user_class,
        grade_scope: user.grade_scope
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginHandler,
  loginLimiter
};
