const { query } = require('../db/pool')

async function getLichtrucByWeekId(weekId) {
  return query('SELECT * FROM Lichtruc WHERE week_id = ?', [weekId]);
}

async function createLichtruc(params) {
  return query('INSERT INTO Lichtruc SET ?', params);
}

async function updateLichtruc({ class_active, class_passive, week_id }) {
    return query('UPDATE Lichtruc SET class_passive = ? WHERE class_active = ? and week_id = ?', [class_passive, class_active, week_id])    
}

async function deleteByClass(classId) {
    return query('DELETE FROM Lichtruc WHERE class_active = ?', [classId])
}

module.exports = {
    getLichtrucByWeekId,
    createLichtruc,
    updateLichtruc,
    deleteByClass
}