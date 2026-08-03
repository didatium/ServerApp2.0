function buildClassRecord(payload = {}) {
  return {
    class_id: payload.class_id || null,
    class_name: payload.class_name || null,
    grade: payload.grade != null ? payload.grade : 0
  };
}

module.exports = {
  buildClassRecord
};
