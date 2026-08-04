const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");

//get one class one week
router.get('/vipham/:class_id/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('select * from Vipham where class_id = ? and week_id = ?', [req.params.class_id, req.params.week_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

  })
});

//get one week
router.get('/vipham/:week_id', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('select * from Vipham where week_id = ?', [req.params.week_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

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
      conn.release()
      if (!err) {
        res.send("Deleted item!")
      } else {
        console.log(err)
      }
    });

  })

});

//delete all accord class_id (protected)
router.delete('/viphamall/:class_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Vipham where class_id = ?', [req.params.class_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted all item!")
      } else {
        console.log(err)
      }
    });

  })

});
//delete all class (protected)
router.delete('/viphamallclass', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Vipham', (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted all item!")
      } else {
        console.log(err)
      }
    });

  })

});

//post one (protected)
router.post('/vipham', auth, authorizeVipham, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO Vipham SET ?', params, (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });
    
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
        conn.release()
        if (!err) {
          res.send("Inserted item!")
        } else { console.log(err); }
      });
    } else {
      // update bonus
      conn.query('UPDATE Vipham SET bonus = ?, quantity = ?, create_by = ?, day = ? WHERE vpm_id ? ', [bonus, quantity, create_by, day, vpm_id], (err, result) => {
        conn.release()
        if (!err) {
          res.send("Inserted bonus!")
        } else { console.log(err); }
      });
    }

  })

});

module.exports = router;