const { query } = require('../db/pool');

async function findByClassAndWeek(classId, weekId) {
  const rows = await query('SELECT * FROM SoDauBai WHERE class_id = ? AND week_id = ?', [classId, weekId]);
  return rows[0] || null
}

async function findByWeek(weekId) {
  return query('SELECT * FROM SoDauBai WHERE week_id = ?', [weekId]);
}

async function findById(recordId) {
  const rows = await query('SELECT * FROM SoDauBai WHERE record_id = ?', [recordId]);
  return rows[0] || null;
}

async function insertSoDauBai(data) {
  // data is expected to be an object matching columns
  return query('INSERT INTO SoDauBai SET ?', [data]);
}

async function updateById(recordId, fields) {
  return query('UPDATE SoDauBai SET ? WHERE record_id = ?', [fields, recordId]);
}

async function deleteById(recordId) {
  return query('DELETE FROM SoDauBai WHERE record_id = ?', [recordId]);
}

async function deleteAll() {
  return query('DELETE FROM SoDauBai');
}

async function deleteByClassId(classId) {
  return query('DELETE FROM SoDauBai WHERE class_id = ?', [classId]);
}

module.exports = {
  findByClassAndWeek,
  findByWeek,
  findById,
  insertSoDauBai,
  updateById,
  deleteById,
  deleteAll,
  deleteByClassId
};
