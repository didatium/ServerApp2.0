const rulesRepository = require('../repositories/rulesRepository')

async function listRules() {
    return rulesRepository.getAllRules()
}

async function findRuleById(ruleId) {
    return rulesRepository.getRuleById(ruleId)
}

async function createRule(params) {
    return rulesRepository.createRule(params)
}

async function deleteRule(ruleId) {
    return rulesRepository.deleteRule(ruleId)
}

async function updateRule(params) {
    return rulesRepository.updateRule(params)
}

module.exports = {
    listRules,
    findRuleById,
    createRule,
    deleteRule,
    updateRule
}