const express = require('express');
const router = express.Router();
const viphamController = require('../src/controllers/viphamController');

//get one class one week
router.get('/vipham/:class_id/:week_id', viphamController.getByClassAndWeek);

//get one week
router.get('/vipham/:week_id', viphamController.getByWeek);

//get one class
router.get('/vipham/:class_id', viphamController.getByClass);

const auth = require('../src/middleware/auth.middleware');
const authorizeVipham = require('../middlewares/authorizeVipham');
const requireRole = require('../src/middleware/requireRole');

//delete one accord vpm_id (protected)
router.delete('/vipham/:vpm_id', auth, authorizeVipham, viphamController.deleteById);

//delete all accord class_id (protected)
router.delete('/viphamall/:class_id', auth, requireRole('admin'), viphamController.deleteByClass);
//delete all class (protected)
router.delete('/viphamallclass', auth, requireRole('admin'), viphamController.deleteAll);

//post one (protected)
router.post('/vipham', auth, authorizeVipham, viphamController.createVipham);

//update one (protected)
router.put('/vipham', auth, authorizeVipham, viphamController.updateVipham);

module.exports = router;
