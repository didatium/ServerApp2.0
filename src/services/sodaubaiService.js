const sodaubaiRepository = require('../repositories/sodaubaiRepository');

async function listByClassAndWeek(classId, weekId) {
  return sodaubaiRepository.findByClassAndWeek(classId, weekId);
}

async function listByWeek(weekId) {
  return sodaubaiRepository.findByWeek(weekId);
}

async function getById(recordId) {
  return sodaubaiRepository.findById(recordId);
}

async function createSoDauBai(data) {
  return sodaubaiRepository.insertSoDauBai(data);
}

async function updateSoDauBai(recordId, fields) {
  return sodaubaiRepository.updateById(recordId, fields);
}

async function removeSoDauBai(recordId) {
  return sodaubaiRepository.deleteById(recordId);
}

async function removeAllSoDauBai() {
  return sodaubaiRepository.deleteAll()
}

module.exports = {
  listByClassAndWeek,
  listByWeek,
  getById,
  createSoDauBai,
  updateSoDauBai,
  removeSoDauBai,
  removeAllSoDauBai
};
