const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

//get all day all class in a week
router.get('/statisticOnDay/:week_id', (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query('Select * from StatisticOnDay where week_id = ?', [req.params.week_id], (err, result) => {
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

    pool.releaseConnection(conn);
  })
});

//get all day one class in all week
router.get('/statisticOnDay/:class_id', (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query("Select * from StatisticOnDay where class_id = ?", [req.params.class_id], (err, result) => {
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

    pool.releaseConnection(conn);
  })
});

//delete everything (protected)
router.delete('/statisticOnDayAll', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query("DELETE from StatisticOnDay", (err, result) => {

      if (!err) {
        res.send("Deleted everything!")
      } else { console.log(err) }

    });
    pool.releaseConnection(conn)
  })
});

//delete one class (protected)
router.delete('/statisticOnDay/:class_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query("DELETE from StatisticOnDay where class_id = ?", [req.params.class_id], (err, result) => {

      if (!err) {
        res.send("Deleted one class!")
      } else { console.log(err) }

    });
    pool.releaseConnection(conn)
  })
});

//post one (protected)
router.post('/statisticOnDay', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO StatisticOnDay VALUES ?', [params.map(item => [item.week_id, item.class_id, item.day, item.quantity])], (err, result) => {

      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });
    pool.releaseConnection(conn)
  })

});

router.put('/statisticOnDay', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { week_id, class_id, day, change } = req.body;

    if(change === "inc"){
      //update name column
      conn.query('UPDATE StatisticOnDay SET quantity = quantity + 1 WHERE week_id = ? and class_id = ? and day = ?', [week_id, class_id, day], (err, result) => {

        if (!err) {
          res.send("Changed item!")
        } else { console.log(err); }

      });

      pool.releaseConnection(conn)      
    } else if(change === "dec"){
      //update name column
      conn.query('UPDATE StatisticOnDay SET quantity = quantity - 1 WHERE week_id = ? and class_id = ? and day = ?', [week_id, class_id, day], (err, result) => {

        if (!err) {
          res.send("Changed item!")
        } else { console.log(err); }

      });
      pool.releaseConnection(conn)
    }
  })

});

module.exports = router;