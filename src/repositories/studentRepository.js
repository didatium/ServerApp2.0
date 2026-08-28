const { query } = require('../db/pool');

async function getAllStudents() {
  return query('SELECT * FROM Student');
}

async function getStudentById(studentId) {
  const rows = await query('SELECT * FROM Student WHERE student_id = ?', [studentId]);
  return rows[0] || null;
}

async function getStudentsByClassId(class_id) {
  const sql = `
    SELECT 
      s.student_id,
      s.student_name,
      s.gioi_tinh,
      s.ngay_sinh,
      c.class_id,
      c.class_name,
      c.grade
    FROM Student s
    INNER JOIN Class c ON s.class_id = c.class_id
    WHERE s.class_id = ?
    ORDER BY c.grade ASC, c.class_name ASC, s.student_id ASC;
  `
  return query(sql, [class_id]);
}

async function createStudent(studentData) {
  return query('INSERT INTO Student SET ?', studentData);
}

async function updateStudent({ student_id, student_name, class_id, gioi_tinh, ngay_sinh }) {
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
  if (gioi_tinh != null) {
    updates.push('gioi_tinh = ?');
    params.push(gioi_tinh);
  }
  if (ngay_sinh != null) {
    updates.push('ngay_sinh = ?');
    params.push(ngay_sinh);
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
  return getStudentById(student_id);
}

async function deleteStudent(studentId) {
  const result = await query('DELETE FROM Student WHERE student_id = ?', [studentId]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentsByClassId,
  createStudent,
  updateStudent,
  deleteStudent
};
