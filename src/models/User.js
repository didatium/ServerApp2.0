function buildUserRecord(payload = {}) {
  return {
    user_id: payload.user_id || null,
    password: payload.password || null,
    user_role: payload.user_role || null,
    user_class: payload.user_class || null,
    role: payload.role || null,
    grade_scope: payload.grade_scope != null ? payload.grade_scope : null
  };
}

module.exports = {
  buildUserRecord
};
