const LichtrucRepository = require('../repositories/lichtrucRepository')

async function listLichtrucByWeekId(weekId) {
    return LichtrucRepository.getLichtrucByWeekId(weekId)
}

async function createLichtruc(params) {
    return LichtrucRepository.createLichtruc(params)
}

async function updateLichtruc(params) {
    return LichtrucRepository.updateLichtruc(params)
}

async function deleteLichtrucByClass(classId) {
    return LichtrucRepository.deleteByClass(classId)
}

module.exports = {
    listLichtrucByWeekId,
    createLichtruc,
    updateLichtruc,
    deleteLichtrucByClass
}