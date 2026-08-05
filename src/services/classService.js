const classRepository = require('../repositories/classRepository');

async function createClassTable(newClass) {
  return classRepository.createClassTable(newClass);
}

async function listClasses() {
  return classRepository.getAllClasses();
}

async function findClassById(classId) {
  return classRepository.getClassById(classId);
}

async function removeClass(classId) {
  return classRepository.deleteClass(classId);
}

async function removeAllClasses() {
  return classRepository.deleteAllClasses();
}

async function createClass(classData) {
  return classRepository.createClass(classData);
}

async function updateClass(classPayload) {
  return classRepository.updateClass(classPayload);
}

module.exports = {
  createClassTable,
  listClasses,
  findClassById,
  removeClass,
  removeAllClasses,
  createClass,
  updateClass
};
