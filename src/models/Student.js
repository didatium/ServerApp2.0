function buildStudentRecord(payload = {}) {
  return {
    student_id: payload.student_id || null,
    student_name: payload.student_name || null,
    class_id: payload.class_id || null
  };
}

module.exports = {
  buildStudentRecord
};
