const express = require('express');
const router = express.Router();
const weekController = require('../src/controllers/weekController')
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

router.get('/week', weekController.listWeeks)
router.post('/week', auth, requireRole('admin'), weekController.createWeek)
router.put('/week', auth, requireRole('admin'), weekController.updateWeek)

module.exports = router;