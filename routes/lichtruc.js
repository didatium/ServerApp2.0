const express = require("express");
const router = express.Router();
const LichtrucController = require('../src/controllers/lichtrucController')
const requireRole = require('../src/middleware/requireRole');
const auth = require('../src/middleware/auth.middleware');

//get one week
router.get('/lichtruc/:week_id', LichtrucController.listLichtrucByWeek)

//post many (protected)
router.post('/lichtruc', auth, requireRole('admin'), LichtrucController.createLichtruc)

//update one (protected)
router.put('/lichtruc', auth, requireRole('admin'), LichtrucController.updateLichtruc)

// delete one (protected)
router.delete('/lichtruc/:class_active', auth, requireRole('admin'), LichtrucController.deleteLichtrucByClass)

// delete all
router.delete('/lichtrucall', auth, requireRole('admin'), LichtrucController.deleteAll)

module.exports = router;