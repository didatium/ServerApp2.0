const express = require('express');
const router = express.Router();
const { loginHandler, loginLimiter } = require('../src/controllers/authController');

router.post('/login', loginLimiter, loginHandler);

module.exports = router;
