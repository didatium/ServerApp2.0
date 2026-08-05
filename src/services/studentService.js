const studentRepository = require('../repositories/studentRepository');

async function listStudents() {
  return studentRepository.getAllStudents();
}

async function findStudentById(studentId) {
  return studentRepository.getStudentById(studentId);
}

async function createStudent(studentPayload) {
  return studentRepository.createStudent(studentPayload);
}

async function updateStudent(studentPayload) {
  return studentRepository.updateStudent(studentPayload);
}

async function removeStudent(studentId) {
  return studentRepository.deleteStudent(studentId);
}

module.exports = {
  listStudents,
  findStudentById,
  createStudent,
  updateStudent,
  removeStudent
};
