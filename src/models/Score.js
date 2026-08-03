function buildScoreRecord(payload = {}) {
  return {
    week_id: payload.week_id || null,
    class_id: payload.class_id || null,
    score: payload.score != null ? payload.score : null,
    deft: payload.deft != null ? payload.deft : null,
    note: payload.note || null
  };
}

module.exports = {
  buildScoreRecord
};
