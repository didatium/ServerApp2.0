const LichtrucRepository = require('../repositories/lichtrucRepository')

async function listLichtrucByWeekId(weekId) {
    return LichtrucRepository.getLichtrucByWeekId(weekId)
}

async function createLichtruc(params) {
    const rows = params.map(item => [item.week_id, item.class_active, item.class_passive])
    return LichtrucRepository.createManyLichtruc(rows)
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