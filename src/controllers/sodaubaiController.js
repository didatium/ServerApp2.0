const sodaubaiService = require('../services/sodaubaiService');

async function getByClassAndWeek(req, res, next) {
  try {
    const { class_id, week_id } = req.params;
    const sodaubai = await sodaubaiService.listByClassAndWeek(class_id, week_id);
    if(!sodaubai) {
      return res.status(404).json({ success: false, message: 'So dau bai khong tim thay!'})
    }
    res.status(200).json({ success: true, data: sodaubai });
  } catch (err) {
    next(err);
  }
}

async function getByWeek(req, res, next) {
  try {
    const { week_id } = req.params;
    const rows = await sodaubaiService.listByWeek(week_id);
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

async function createSoDauBai(req, res, next) {
  try {
    const params = req.body;
    const result = await sodaubaiService.createSoDauBai(params);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function updateSoDauBai(req, res, next) {
  try {
    const { record_id } = req.params;
    // allow body to provide fields to update
    const params = req.body;
    const result = await sodaubaiService.updateSoDauBai(record_id, params);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteSoDauBai(req, res, next) {
  try {
    const { record_id } = req.params;
    const result = await sodaubaiService.removeSoDauBai(record_id);
    return res.status(200).json({ success: true, message: `Da xoa record_id = ${record_id}` });
  } catch (err) {
    next(err);
  }
}

async function deleteSoDauBaiByClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const result = await sodaubaiService.removeSoDauBaiByClass(class_id);
    return res.status(200).json({ success: true, message: `Da xoa so dau bai cua lop ${class_id}` });
  } catch (err) {
    next(err);
  }
}

async function deleteAll(req, res, next) {
  try {
    await sodaubaiService.removeAllSoDauBai()
    res.status(200).json({ success: true, message: 'Deleted all so dau bai!' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByClassAndWeek,
  getByWeek,
  createSoDauBai,
  updateSoDauBai,
  deleteSoDauBai,
  deleteAll,
  deleteSoDauBaiByClass
};
