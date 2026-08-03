function buildLichTrucRecord(payload = {}) {
  return {
    week_id: payload.week_id || null,
    class_active: payload.class_active || null,
    class_passive: payload.class_passive || null
  };
}

module.exports = {
  buildLichTrucRecord
};
