const { query, pool } = require('../db/pool')

async function getLichtrucByWeekId(weekId) {
  return query('SELECT * FROM Lichtruc WHERE week_id = ?', [weekId]);
}

async function createManyLichtruc(params) {
  // params: bulk insert
  const sql = `
    INSERT INTO Lichtruc (week_id, class_active, class_passive) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE 
      class_passive = VALUES(class_passive)
  `;
  return pool.query(sql, [params]);
}

async function updateLichtruc({ class_active, class_passive, week_id }) {
    return query('UPDATE Lichtruc SET class_passive = ? WHERE class_active = ? and week_id = ?', [class_passive, class_active, week_id])    
}

async function deleteByClass(classId) {
    return query('DELETE FROM Lichtruc WHERE class_active = ?', [classId])
}

module.exports = {
    getLichtrucByWeekId,
    createManyLichtruc,
    updateLichtruc,
    deleteByClass
}