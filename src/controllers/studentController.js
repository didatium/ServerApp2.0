const studentService = require('../services/studentService');
const { createStudentValidator, updateStudentValidator } = require('../utils/validators');

async function listStudents(req, res, next) {
  try {
    const students = await studentService.listStudents();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
}

async function getStudent(req, res, next) {
  try {
    const { student_id } = req.params;
    const student = await studentService.findStudentById(student_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
}

async function getByClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const student = await studentService.findStudentByClassId(class_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    const payload = createStudentValidator(req.body);
    const student = await studentService.createStudent(payload);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    const params = updateStudentValidator(req.body);
    const student = await studentService.updateStudent(params);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
}

async function deleteStudent(req, res, next) {
  try {
    const { student_id } = req.params;
    const deleted = await studentService.removeStudent(student_id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listStudents,
  getStudent,
  getByClass,
  createStudent,
  updateStudent,
  deleteStudent
};
