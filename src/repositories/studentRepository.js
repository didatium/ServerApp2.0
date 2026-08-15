const { query } = require('../db/pool');

async function getAllStudents() {
  return query('SELECT * FROM Student');
}

async function getStudentById(studentId) {
  const rows = await query('SELECT * FROM Student WHERE student_id = ?', [studentId]);
  return rows[0] || null;
}

async function getStudentsByClassId(class_id) {
  return query(
    `SELECT student_id, student_name FROM Student WHERE class_id = ?
     ORDER BY student_name ASC`,
    [class_id]
  );
}

async function createStudent(studentData) {
  return query('INSERT INTO Student SET ?', studentData);
}

async function updateStudent({ student_id, student_name, class_id }) {
  const updates = [];
  const params = [];

  if (student_name != null) {
    updates.push('student_name = ?');
    params.push(student_name);
  }
  if (class_id != null) {
    updates.push('class_id = ?');
    params.push(class_id);
  }

  if (updates.length === 0) {
    return getStudentById(student_id);
  }

  params.push(student_id);
  const sql = `UPDATE Student SET ${updates.join(', ')} WHERE student_id = ?`;
  const result = await query(sql, params);
  if (result.affectedRows === 0) {
    return null;
  }
  return getStudentById(studentId);
}

async function deleteStudent(studentId) {
  const result = await query('DELETE FROM Student WHERE student_id = ?', [studentId]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
