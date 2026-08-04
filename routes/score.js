const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');
const authorizeScore = require('../middlewares/authorizeScore');

//get all
router.get('/score/:week_id', (req, res) => {
  pool.getConnection(function(err, conn) {

    conn.query('select * from Score where week_id = ?', [req.params.week_id], (err, result) => {
      conn.release()
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

  })
});

router.get('/scoreallweek', (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err)
    }

    conn.query('select * from Score', (err, result) => {
      conn.release()
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

  })
});

//delete one accord class_id (protected)
router.delete('/score/:class_id', auth, authorizeScore, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Score where class_id = ?', [req.params.class_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted item!")
      } else { console.log(err) }

    });

  })

});

//delete all (protected - admin only)
router.delete('/scoreall', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Score', (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted all item!")
      } else { console.log(err) }

    });

  })

});

//post one (protected)
router.post('/score', auth, authorizeScore, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO Score VALUES ?', [params.map(item => [item.week_id, item.class_id, item.score, item.deft, item.note])], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

//update one score (protected)
router.put('/score', auth, authorizeScore, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { score, week_id, class_id } = req.body;

    //update name column
    conn.query('UPDATE Score SET score = ? WHERE week_id = ? and class_id = ?', [score, week_id, class_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

//update one note (protected)
router.put('/scorenote', auth, authorizeScore, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { note, week_id, class_id } = req.body;

    //update name column
    conn.query('UPDATE Score SET note = ? WHERE week_id = ? and class_id = ?', [note, week_id, class_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

//update one default (protected)
router.put('/scoredef', auth, authorizeScore, (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { deft, week_id, class_id } = req.body;

    //update name column
    conn.query('UPDATE Score SET deft = ? WHERE week_id = ? and class_id = ?', [deft, week_id, class_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });

  })

});

module.exports = router