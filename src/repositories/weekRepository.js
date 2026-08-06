const { query } = require('../db/pool')

async function getAllWeeks() {
    return query('SELECT * FROM Week')
}

async function createWeek(weekData) {
    return query('INSERT INTO Week SET ?', weekData)
}

async function updateWeek({ week_id, start_date, end_date }) {
    return query('UPDATE Week SET start_date = ?, end_date = ? WHERE week_id = ?', [start_date, end_date, week_id])
}

module.exports = {
    getAllWeeks,
    createWeek,
    updateWeek
}