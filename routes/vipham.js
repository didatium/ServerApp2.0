const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");

//get one class one week
router.get('/vipham/:class_id/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('select * from Vipham where class_id = ? and week_id = ?', [req.params.class_id, req.params.week_id], (err, result) => {

      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

    pool.releaseConnection(conn)
  })
});

//get one week
router.get('/vipham/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('select * from Vipham where week_id = ?', [req.params.week_id], (err, result) => {

      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

    pool.releaseConnection(conn)
  })
});

const auth = require('../src/middleware/auth.middleware');
const authorizeVipham = require('../middlewares/authorizeVipham');
const requireRole = require('../src/middleware/requireRole');

//delete one accord vpm_id (protected)
router.delete('/vipham/:vpm_id', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Vipham where vpm_id = ?', [req.params.vpm_id], (err, result) => {

      if (!err) {
        res.send("Deleted item!")
      } else {
        console.log(err)
      }
    });

    pool.releaseConnection(conn)
  })

});

//delete all accord class_id (protected)
router.delete('/viphamall/:class_id', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Vipham where class_id = ?', [req.params.class_id], (err, result) => {

      if (!err) {
        res.send("Deleted all item!")
      } else {
        console.log(err)
      }
    });

    pool.releaseConnection(conn)
  })

});
//delete all class (protected)
router.delete('/viphamallclass', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Vipham', (err, result) => {

      if (!err) {
        res.send("Deleted all item!")
      } else {
        console.log(err)
      }
    });

    pool.releaseConnection(conn)
  })

});

//post one (protected)
router.post('/vipham', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO Vipham SET ?', params, (err, result) => {

      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });
    pool.releaseConnection(conn)
  })

});

//update one (protected)
router.put('/vipham', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { vpm_id, week_id, class_id, bonus, name_vp_id, quantity, name_student, create_by, modified_by, day } = req.body;

    //update name column
    if (bonus == null) {
      conn.query('UPDATE Vipham SET name_vp_id = ?, quantity = ?, modified_by = ?, name_student = ?, day = ? WHERE vpm_id = ?', [name_vp_id, quantity, modified_by, name_student, day, vpm_id], (err, result) => {
        if (!err) {
          res.send("Inserted item!")
        } else { console.log(err); }
      });
    } else {
      conn.query('UPDATE Vipham SET name_student = ?, quantity = ?, create_by = ?, day = ? WHERE bonus = ? and week_id = ? and class_id = ? ', [name_student, quantity, create_by, day, bonus, week_id, class_id], (err, result) => {
        if (!err) {
          res.send("Inserted bonus!")
        } else { console.log(err); }
      });
    }

    pool.releaseConnection(conn)
  })

});

module.exports = router;