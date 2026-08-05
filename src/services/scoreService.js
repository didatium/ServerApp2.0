const scoreRepository = require('../repositories/scoreRepository');

async function listByWeek(weekId) {
  return scoreRepository.findByWeek(weekId);
}

async function listAll() {
  return scoreRepository.findAll();
}

async function removeByClass(classId) {
  return scoreRepository.deleteByClass(classId);
}

async function removeAll() {
  return scoreRepository.deleteAll();
}

async function createScores(items) {
  // items: array of objects or array of arrays; original route expected array of objects
  // Normalize to array of arrays
  const rows = items.map(item => [item.week_id, item.class_id, item.score, item.deft, item.note]);
  return scoreRepository.insertMany(rows);
}

async function updateScore(payload) {
  return scoreRepository.updateScore(payload);
}

async function updateNote(payload) {
  return scoreRepository.updateNote(payload);
}

async function updateDeft(payload) {
  return scoreRepository.updateDeft(payload);
}

module.exports = {
  listByWeek,
  listAll,
  removeByClass,
  removeAll,
  createScores,
  updateScore,
  updateNote,
  updateDeft
};
