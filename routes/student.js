const express = require('express');
const router = express.Router();
const studentController = require('../src/controllers/studentController');
const requireRole = require('../src/middleware/requireRole');
const auth = require('../src/middleware/auth.middleware');

router.get('/student', studentController.listStudents);
router.get('/student/:student_id', studentController.getStudent);
router.get('/student/class/:class_id', studentController.getByClass);
router.post('/student', auth, requireRole('admin'), studentController.createStudent);
router.put('/student', auth, requireRole('admin'), studentController.updateStudent);
router.delete('/student/:student_id', auth, requireRole('admin'), studentController.deleteStudent);

module.exports = router;
