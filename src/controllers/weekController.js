const weekService = require('../services/weekService')
const { createWeekValidator, updateWeekValidator } = require('../utils/validators')

async function listWeeks(req, res, next) {
    try {
        const weeks = await weekService.listWeeks();
        res.status(200).json({ success: true, data: weeks })
    } catch (error) {
        next(error)
    }
}

async function createWeek(req, res, next) {
    try {
        const params = createWeekValidator(req.body)
        const week = await weekService.createWeek(params)
        res.status(201).json({ success: true, data: week })
    } catch (error) {
        next(error)
    }
}

async function updateWeek(req, res, next) {
    try {
        const params = updateWeekValidator(req.body)
        const week = await weekService.updateWeek(params)
        if(!week) {
            return res.status(404).json({ success: false, message: 'Week not found'})
        }
        res.status(200).json({ success: true, data: week})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listWeeks,
    createWeek,
    updateWeek
}