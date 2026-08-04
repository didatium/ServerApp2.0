function buildUserRecord(payload = {}) {
  return {
    user_id: payload.user_id || null,
    password: payload.password || null,
    user_name: payload.user_name || null,
    user_class: payload.user_class || null,
    role: payload.role || null,
    grade_scope: payload.grade_scope != null ? payload.grade_scope : null
  };
}

module.exports = {
  buildUserRecord
};
