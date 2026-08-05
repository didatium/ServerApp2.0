const { query } = require('../db/pool');

async function findByClassAndWeek(classId, weekId) {
  return query('SELECT * FROM Vipham WHERE class_id = ? AND week_id = ?', [classId, weekId]);
}

async function findByWeek(weekId) {
  return query('SELECT * FROM Vipham WHERE week_id = ?', [weekId]);
}

async function findById(vpmId) {
  const rows = await query('SELECT * FROM Vipham WHERE vpm_id = ?', [vpmId]);
  return rows[0] || null;
}

async function deleteById(vpmId) {
  return query('DELETE FROM Vipham WHERE vpm_id = ?', [vpmId]);
}

async function deleteByClass(classId) {
  return query('DELETE FROM Vipham WHERE class_id = ?', [classId]);
}

async function deleteAll() {
  return query('DELETE FROM Vipham');
}

async function createVipham(params) {
  return query('INSERT INTO Vipham SET ?', params);
}

async function updateViphamFields({ vpm_id, name_vp_id, quantity, modified_by, name_student, day }) {
  return query('UPDATE Vipham SET name_vp_id = ?, quantity = ?, modified_by = ?, name_student = ?, day = ? WHERE vpm_id = ?', [name_vp_id, quantity, modified_by, name_student, day, vpm_id]);
}

async function updateViphamBonus({ vpm_id, bonus, quantity, create_by, day }) {
  return query('UPDATE Vipham SET bonus = ?, quantity = ?, create_by = ?, day = ? WHERE vpm_id = ?', [bonus, quantity, create_by, day, vpm_id]);
}

module.exports = {
  findByClassAndWeek,
  findByWeek,
  findById,
  deleteById,
  deleteByClass,
  deleteAll,
  createVipham,
  updateViphamFields,
  updateViphamBonus
};