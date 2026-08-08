const express = require('express');
const router = express.Router();
const classController = require('../src/controllers/classController');
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

//get all (public)
router.get('/class', classController.listClasses);

//get one (public)
router.get('/class/:class_id', classController.getClass);

//delete one (protected)
router.delete('/class/:class_id', auth, requireRole('admin'), classController.deleteClass);

//delete all (protected)
router.delete('/classall', auth, requireRole('admin'), classController.deleteAllClasses);

//post one (protected)
router.post('/class', auth, requireRole('admin'), classController.createClass);

//update one (protected)
router.put('/class', auth, requireRole('admin'), classController.updateClass);

module.exports = router;
