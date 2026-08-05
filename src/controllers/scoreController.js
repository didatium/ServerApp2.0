const scoreService = require('../services/scoreService');
const { createScoreValidator, updateScoreValidator } = require('../utils/validators')

async function getByWeek(req, res, next) {
  try {
    const { week_id } = req.params;
    const rows = await scoreService.listByWeek(week_id);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getAllWeeks(req, res, next) {
  try {
    const rows = await scoreService.listAll();
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function deleteByClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const result = await scoreService.removeByClass(class_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Score not found for class' });
    }
    res.status(200).json({ success: true, message: `Delete score of ${ class_id }!` });
  } catch (err) {
    next(err);
  }
}

async function deleteAll(req, res, next) {
  try {
    await scoreService.removeAll();    
    res.status(200).json({ success: true, message: `Delete score of all classes!` });
  } catch (err) {
    next(err);
  }
}

async function createScores(req, res, next) {
  try {
    const params = createScoreValidator(req.body);
    const created = await scoreService.createScores(params);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

async function updateScore(req, res, next) {
  try {
    const { score, week_id, class_id } = updateScoreValidator(req.body);
    const updated = await scoreService.updateScore({ score, week_id, class_id });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const { note, week_id, class_id } = updateScoreValidator(req.body);
    const updated = await scoreService.updateNote({ note, week_id, class_id });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function updateDeft(req, res, next) {
  try {
    const { deft, week_id, class_id } = updateScoreValidator(req.body);
    const updated = await scoreService.updateDeft({ deft, week_id, class_id });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByWeek,
  getAllWeeks,
  deleteByClass,
  deleteAll,
  createScores,
  updateScore,
  updateNote,
  updateDeft
};
