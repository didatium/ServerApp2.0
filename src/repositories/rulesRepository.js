const { query } = require('../db/pool')

async function getAllRules() {
    return query('SELECT * FROM Rules')
}

async function getRuleById(ruleId) {
    const rows = await query('SELECT * FROM Rules WHERE name_vp_id = ?', [ruleId])
    return rows[0] || null
}

async function deleteRule(ruleId) {
    return query('DELETE FROM Rules WHERE name_vp_id = ?', [ruleId])
}

async function createRule(ruleData) {
    return query('INSERT INTO Rules SET ?', ruleData)
}

async function updateRule({ name_vp_id, name_vp, minus_pnt }) {
    return query('UPDATE Rules SET name_vp = ?, minus_pnt = ? WHERE name_vp_id = ?', [name_vp, minus_pnt, name_vp_id])
}

module.exports = {
    getAllRules,
    getRuleById,
    deleteRule,
    createRule,
    updateRule
}