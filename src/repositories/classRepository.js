const { query } = require('../db/pool');

function validateTableName(name) {
  if (!name || typeof name !== 'string') return false;
  // Allow only alphanumeric and underscore, starting with letter or underscore.
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
}

async function createClassTable(newClass) {
  if (!validateTableName(newClass)) {
    throw new Error('Invalid table name for new class');
  }

  const sql = 'CREATE TABLE IF NOT EXISTS `' + newClass + '` (`hs_id` varchar(6) PRIMARY KEY, `hs_name` varchar(100), `hs_vpm` varchar(1000))';
  return query(sql);
}

async function getAllClasses() {
  return query('SELECT * FROM Class');
}

async function getClassById(classId) {
  const rows = await query('SELECT * FROM Class WHERE class_id = ?', [classId]);
  return rows[0] || null;
}

async function deleteClass(classId) {
  return query('DELETE FROM Class WHERE class_id = ?', [classId]);
}

async function deleteAllClasses() {
  return query('DELETE FROM Class');
}

async function createClass(classData) {
  return query('INSERT INTO Class SET ?', classData);
}

async function updateClass({ class_id, class_name, grade }) {
  return query('UPDATE Class SET class_name = ?, grade = ? WHERE class_id = ?', [class_name, grade, class_id]);
}

module.exports = {
  createClassTable,
  getAllClasses,
  getClassById,
  deleteClass,
  deleteAllClasses,
  createClass,
  updateClass
};
