const express = require("express");
const router = express.Router();
const rulesController = require('../src/controllers/rulesController')
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

//get all
router.get('/rules', rulesController.listRules)

//get one
router.get('/rules/:name_vp_id', rulesController.getRuleById)

//delete one (protected)
router.delete('/rules/:name_vp_id', auth, requireRole('admin'), rulesController.deleteRule)

//post one (protected)
router.post('/rules', auth, requireRole('admin'), rulesController.createRule)

//update one (protected)
router.put('/rules', auth, requireRole('admin'), rulesController.updateRule)

module.exports = router