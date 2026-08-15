const viphamRepository = require('../repositories/viphamRepository');

async function listByClassAndWeek(classId, weekId) {
  return viphamRepository.findByClassAndWeek(classId, weekId);
}

async function listByWeek(weekId) {
  return viphamRepository.findByWeek(weekId);
}

async function listByClass(classId) {
  return viphamRepository.findByClass(classId);
}

async function getById(vpmId) {
  return viphamRepository.findById(vpmId);
}

async function removeById(vpmId) {
  return viphamRepository.deleteById(vpmId);
}

async function removeByClass(classId) {
  return viphamRepository.deleteByClass(classId);
}

async function removeAll() {
  return viphamRepository.deleteAll();
}

async function createVipham(params) {
  return viphamRepository.createVipham(params);
}

async function updateVipham(payload) {
  // business logic: if bonus == null update fields else update bonus
  if (payload.bonus == null) {
    return viphamRepository.updateVipham(payload);
  }
  return viphamRepository.updateViphamBonus(payload);
}

module.exports = {
  listByClassAndWeek,
  listByWeek,
  listByClass,
  getById,
  removeById,
  removeByClass,
  removeAll,
  createVipham,
  updateVipham
};