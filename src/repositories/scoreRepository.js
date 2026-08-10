const { query, pool } = require('../db/pool');

async function findByWeek(weekId) {
  return query('SELECT * FROM Score WHERE week_id = ?', [weekId]);
}

async function findAll() {
  return query('SELECT * FROM Score');
}

async function deleteByClass(classId) {
  return query('DELETE FROM Score WHERE class_id = ?', [classId]);
}

async function deleteAll() {
  return query('DELETE FROM Score');
}

async function insertMany(scoreRows) {
  // scoreRows: array of arrays [[week_id, class_id, score, deft, note], ...]
  // Use bulk insert with VALUES ? parameter (mysql2 supports this)
  const sql = `
    INSERT INTO Score (week_id, class_id, score, deft, note) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE 
      score = VALUES(score), 
      deft = VALUES(deft), 
      note = VALUES(note)
  `;
  
  return pool.query(sql, [scoreRows]);
}

async function updateScore({ score, week_id, class_id }) {
  return query('UPDATE Score SET score = ? WHERE week_id = ? AND class_id = ?', [score, week_id, class_id]);
}

async function updateNote({ note, week_id, class_id }) {
  return query('UPDATE Score SET note = ? WHERE week_id = ? AND class_id = ?', [note, week_id, class_id]);
}

async function updateDeft({ deft, week_id, class_id }) {
  return query('UPDATE Score SET deft = ? WHERE week_id = ? AND class_id = ?', [deft, week_id, class_id]);
}

module.exports = {
  findByWeek,
  findAll,
  deleteByClass,
  deleteAll,
  insertMany,
  updateScore,
  updateNote,
  updateDeft
};
