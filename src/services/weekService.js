const weekRepository = require('../repositories/weekRepository')

async function listWeeks() {
    return weekRepository.getAllWeeks()
}

async function createWeek(weekData) {
    return weekRepository.createWeek(weekData)
}

async function updateWeek(weekData) {
    return weekRepository.updateWeek(weekData)
}

module.exports = {
    listWeeks,
    createWeek,
    updateWeek
}