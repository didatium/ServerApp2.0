const LichtrucService = require('../services/lichtrucService')
const { createLichTrucValidator, updateLichTrucValidator } = require('../utils/validators')

async function listLichtrucByWeek(req, res, next) {
    try {
        const { week_id } = req.params
        const result = await LichtrucService.listLichtrucByWeekId(week_id)
        res.status(200).json({ success: true, data: result })
    } catch (error) {
        next(error)   
    }
}

async function createLichtruc(req, res, next) {
    try {
        const params = req.body
        const result = await LichtrucService.createLichtruc(params)
        res.status(201).json({ success: true, data: result })
    } catch (error) {
        next(error)        
    }
}

async function updateLichtruc(req, res, next) {
    try {
        const params = req.body
        const result = await LichtrucService.updateLichtruc(params)
        res.status(200).json({ success: true, data: result })
    } catch (error) {
        next(error)
    }
}

async function deleteLichtrucByClass(req, res, next) {
    try {
        const { class_id } = req.params
        await LichtrucService.deleteLichtrucByClass(class_id)
        res.status(200).json({ success: true, message: `Delete all lich truc of ${ class_id}`})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listLichtrucByWeek,
    createLichtruc,
    updateLichtruc,
    deleteLichtrucByClass
}