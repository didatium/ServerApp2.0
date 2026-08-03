function buildWeekRecord(payload = {}) {
  return {
    week_id: payload.week_id || null,
    week_name: payload.week_name || null,
    start_date: payload.start_date || null,
    end_date: payload.end_date || null
  };
}

module.exports = {
  buildWeekRecord
};
