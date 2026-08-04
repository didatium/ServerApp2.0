const express = require('express');
const router = express.Router();
const { pool } = require('../db/db-config.js');

// public reads
router.get('/sodaubai/:class_id/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); return res.status(500).json({ success: false, message: 'DB connection error' }); }

    conn.query('SELECT * FROM SoDauBai WHERE class_id = ? AND week_id = ?', [req.params.class_id, req.params.week_id], (err, result) => {
      conn.release();
      if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Query error' }); }
      return res.json(result);
    });
  });
});

router.get('/sodaubai/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); return res.status(500).json({ success: false, message: 'DB connection error' }); }

    conn.query('SELECT * FROM SoDauBai WHERE week_id = ?', [req.params.week_id], (err, result) => {
      conn.release();
      if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Query error' }); }
      return res.json(result);
    });
  });
});

const auth = require('../src/middleware/auth.middleware');
const authorizeSoDauBai = require('../middlewares/authorizeSoDauBai');

// create (protected)
router.post('/sodaubai', auth, authorizeSoDauBai, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); return res.status(500).json({ success: false, message: 'DB connection error' }); }

    const params = req.body;

    conn.query('INSERT INTO SoDauBai SET ?', params, (err, result) => {
      conn.release();
      if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Insert error' }); }
      return res.json({ success: true, insertId: result.insertId });
    });
  });
});

// update by record_id (protected)
router.put('/sodaubai/:record_id', auth, authorizeSoDauBai, (req, res) => {
  const recordId = req.params.record_id;
  const params = req.body;

  pool.getConnection((err, conn) => {
    if (err) { console.log(err); return res.status(500).json({ success: false, message: 'DB connection error' }); }

    conn.query('UPDATE SoDauBai SET ? WHERE record_id = ?', [params, recordId], (err, result) => {
      conn.release();
      if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Update error' }); }
      return res.json({ success: true, affectedRows: result.affectedRows });
    });
  });
});

// delete by record_id (protected)
router.delete('/sodaubai/:record_id', auth, authorizeSoDauBai, (req, res) => {
  const recordId = req.params.record_id;
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); return res.status(500).json({ success: false, message: 'DB connection error' }); }

    conn.query('DELETE FROM SoDauBai WHERE record_id = ?', [recordId], (err, result) => {
      conn.release();
      if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Delete error' }); }
      return res.json({ success: true, affectedRows: result.affectedRows });
    });
  });
});

module.exports = router;
