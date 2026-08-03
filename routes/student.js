const express = require('express');
const router = express.Router();
const studentController = require('../src/controllers/studentController');
const requireRole = require('../src/middleware/requireRole');

router.get('/student', studentController.listStudents);
router.get('/student/:student_id', studentController.getStudent);
router.post('/student', requireRole('admin'), studentController.createStudent);
router.put('/student/:student_id', requireRole('admin'), studentController.updateStudent);
router.delete('/student/:student_id', requireRole('admin'), studentController.deleteStudent);

module.exports = router;
