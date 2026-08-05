const express = require('express');
const router = express.Router();
const sodaubaiController = require('../src/controllers/sodaubaiController');
const auth = require('../src/middleware/auth.middleware');
const authorizeSoDauBai = require('../middlewares/authorizeSoDauBai');

// public reads
router.get('/sodaubai/:class_id/:week_id', sodaubaiController.getByClassAndWeek);
router.get('/sodaubai/:week_id', sodaubaiController.getByWeek);

// create (protected)
router.post('/sodaubai', auth, authorizeSoDauBai, sodaubaiController.createSoDauBai);

// update by record_id (protected)
router.put('/sodaubai/:record_id', auth, authorizeSoDauBai, sodaubaiController.updateSoDauBai);

// delete by record_id (protected)
router.delete('/sodaubai/:record_id', auth, authorizeSoDauBai, sodaubaiController.deleteSoDauBai);

module.exports = router;