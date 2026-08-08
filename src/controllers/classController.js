const { date } = require('joi');
const classService = require('../services/classService');
const { createClassValidator, updateClassValidator } = require("../utils/validators")

async function listClasses(req, res, next) {
  try {
    const classes = await classService.listClasses();
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    next(error);
  }
}

async function getClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const classItem = await classService.findClassById(class_id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, data: classItem });
  } catch (error) {
    next(error);
  }
}

async function deleteClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const result = await classService.removeClass(class_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, message: `Deleted ${ class_id }!` });
  } catch (error) {
    next(error);
  }
}

async function deleteAllClasses(req, res, next) {
  try {
    await classService.removeAllClasses();
    res.status(200).json({ success: true, message: 'Deleted all classes!' });
  } catch (error) {
    next(error);
  }
}

async function createClass(req, res, next) {
  try {
    const params = createClassValidator(req.body);
    const result = classService.createClass(params);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function updateClass(req, res, next) {
  try {
    const { class_id, class_name, grade } = updateClassValidator(req.body);
    if (!class_id) {
      return res.status(400).json({ success: false, message: 'class_id is required' });
    }

    const result = await classService.updateClass({ class_id, class_name, grade });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listClasses,
  getClass,
  deleteClass,
  deleteAllClasses,
  createClass,
  updateClass
};
