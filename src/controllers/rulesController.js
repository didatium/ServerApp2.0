const { date } = require('joi')
const rulesService = require('../services/rulesService')
const { createRulesValidator, updateRulesValidator } = require('../utils/validators')

async function listRules(req, res, next) {
	try {
		const rules = await rulesService.listRules()
		res.status(200).json({ success: true, data: rules})
	} catch (error) {
		next(error)
	}
}

async function getRuleById(req, res, next) {
	try {
		const { name_vp_id } = req.params
		const rule = await rulesService.findRuleById(name_vp_id)
		if(!rule) {
			return res.status(404).json({ success: false, message: "Rule not found!"})
		}
		res.status(200).json({ success: true, data: rule })
	} catch (error) {
		next(error)
	}
}

async function createRule(req, res, next) {
	try {
		const params = createRulesValidator(req.body)
		const rule = await rulesService.createRule(params)
		res.status(201).json({ success: true, data: rule })
	} catch (error) {
		next(error);
	}
}

async function updateRule(req, res, next) {
	try {
		const params = updateRulesValidator(req.body);
		const rule = await rulesService.updateRule(params);
		if (!rule) {
			return res.status(404).json({ success: false, message: 'Rule not found' });
		}
		res.status(200).json({ success: true, data: rule });
	} catch (error) {
		next(error)
	}
}

async function deleteRule(req, res, next) {
	try {
		const { name_vp_id } = req.params
		const deleted = await rulesService.deleteRule(name_vp_id)
		if(!deleted) {
			return res.status(404).json({ success: false, message: 'Rule not found'})
		}
		res.status(200).json({ success: true, message: 'Rule deteled!'})
	} catch (error) {
		next(error)      
	}
}

module.exports = {
	listRules,
	getRuleById,
	createRule,
	updateRule,
	deleteRule
}