const express = require('express');
const router = express.Router();
const scoreController = require('../src/controllers/scoreController');
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');
const authorizeScore = require('../middlewares/authorizeScore');

//get all
router.get('/score/:week_id', scoreController.getByWeek);

router.get('/scoreallweek', scoreController.getAllWeeks);

//delete one accord class_id (protected)
router.delete('/score/:class_id', auth, authorizeScore, scoreController.deleteByClass);

//delete all (protected - admin only)
router.delete('/scoreall', auth, requireRole('admin'), scoreController.deleteAll);

//post many (protected)
router.post('/score', auth, authorizeScore, scoreController.createScores);

//update one score (protected)
router.put('/score', auth, authorizeScore, scoreController.updateScore);

//update one note (protected)
router.put('/scorenote', auth, authorizeScore, scoreController.updateNote);

//update one default (protected)
router.put('/scoredef', auth, authorizeScore, scoreController.updateDeft);

module.exports = router;