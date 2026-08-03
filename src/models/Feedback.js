function buildFeedbackRecord(payload = {}) {
  return {
    fbk_id: payload.fbk_id || null,
    name: payload.name || null,
    sdt: payload.sdt || null,
    address: payload.address || null,
    feed: payload.feed || null,
    school: payload.school || null
  };
}

module.exports = {
  buildFeedbackRecord
};
