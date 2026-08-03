function buildViphamRecord(payload = {}) {
  return {
    vpm_id: payload.vpm_id || null,
    week_id: payload.week_id || null,
    class_id: payload.class_id || null,
    name_vp_id: payload.name_vp_id != null ? payload.name_vp_id : null,
    quantity: payload.quantity != null ? payload.quantity : null,
    student_id: payload.student_id || null,
    name_student: payload.name_student || null,
    create_by: payload.create_by || null,
    create_at: payload.create_at || null,
    bonus: payload.bonus || null,
    modified_by: payload.modified_by || null,
    day: payload.day != null ? payload.day : null
  };
}

module.exports = {
  buildViphamRecord
};
