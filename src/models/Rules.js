function buildRulesRecord(payload = {}) {
  return {
    name_vp_id: payload.name_vp_id != null ? payload.name_vp_id : null,
    name_vp: payload.name_vp || null,
    minus_pnt: payload.minus_pnt != null ? payload.minus_pnt : null,
    type: payload.type || null
  };
}

module.exports = {
  buildRulesRecord
};
