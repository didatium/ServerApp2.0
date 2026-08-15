const viphamService = require('../services/viphamService');
const { createViphamValidator, updateViphamValidator } = require('../utils/validators')

async function getByClassAndWeek(req, res, next) {
  try {
    const { class_id, week_id } = req.params;
    const rows = await viphamService.listByClassAndWeek(class_id, week_id);
    res.status(200).json({success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getByWeek(req, res, next) {
  try {
    const { week_id } = req.params;
    const rows = await viphamService.listByWeek(week_id);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getByClass(req, res, next) {
  try {
    const { class_id } = req.params;
    const rows = await viphamService.listByClass(class_id);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function deleteById(req, res, next) {
  try {
    const { vpm_id } = req.params;
    const result = await viphamService.removeById(vpm_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Vi pham not found' });
    }
    res.status(200).json({ success: true, message: 'Deleted vi pham!' });
  } catch (err) {
    next(err);
  }
}

async function deleteByClass(req, res, next) {
  try {
    const { class_id } = req.params;
    await viphamService.removeByClass(class_id);
    res.status(200).json({ success: true, message: `Deleted all vi pham of ${class_id}!` });
  } catch (err) {
    next(err);
  }
}

async function deleteAll(req, res, next) {
  try {
    await viphamService.removeAll();
    res.status(200).json({ success: true, message: 'Deleted all vi pham!' });
  } catch (err) {
    next(err);
  }
}

async function createVipham(req, res, next) {
  try {
    const params = req.body;
    const vipham = await viphamService.createVipham(params);
    res.status(201).json({ success: true, data: vipham });
  } catch (err) {
    next(err);
  }
}

async function updateVipham(req, res, next) {
  try {
    const payload = req.body;
    const result = await viphamService.updateVipham(payload);
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByClassAndWeek,
  getByWeek,
  getByClass,
  deleteById,
  deleteByClass,
  deleteAll,
  createVipham,
  updateVipham
};