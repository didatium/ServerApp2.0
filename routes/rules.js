const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

//get all
router.get('/rules', (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err)
    }

    conn.query('select * from Rules', (err, result) => {
      conn.release()
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

  })
});

//get one
router.get('/rules/:name_vp_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('SELECT * from Rules where name_vp_id = ?', [req.params.name_vp_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

  })

});

//delete one (protected)
router.delete('/rules/:name_vp_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Rules where name_vp_id = ?', [req.params.name_vp_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted item!")
      } else {
        console.log(err)
      }
    });

  })

});

//post one (protected)
router.post('/rules', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO Rules SET ?', params, (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

//update one (protected)
router.put('/rules', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { name_vp_id, name_vp, minus_pnt } = req.body;

    //update name column
    conn.query('UPDATE Rules SET name_vp = ?, minus_pnt = ? WHERE name_vp_id = ?', [name_vp, minus_pnt, name_vp_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

module.exports = router