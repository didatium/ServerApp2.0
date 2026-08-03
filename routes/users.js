const express = require("express");
const router = express.Router();
const { pool } = require("../db/db-config.js");
const requireRole = require('../src/middleware/requireRole');
const auth = require('../src/middleware/auth.middleware');

//get all (admin only)
router.get('/userall', auth, requireRole('admin'), (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query('select * from Users', (err, result) => {
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

    pool.releaseConnection(conn);
  })
});

//get execpt admin (admin only)
router.get('/user', auth, requireRole('admin'), (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query("select * from Users where user_id != 'ur-adm'", (err, result) => {
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

    pool.releaseConnection(conn);
  })
});

//get one (admin only)
router.get('/user/:user_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('SELECT * from Users where user_id = ?', [req.params.user_id], (err, result) => {

      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

    pool.releaseConnection(conn)
  })

});

//delete one (protected)
router.delete('/user/:user_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Users where user_id = ?', [req.params.user_id], (err, result) => {

      if (!err) {
        res.send("Deleted item!")
      } else { console.log(err) }

    });
    pool.releaseConnection(conn)
  })
});

//delete all (protected)
router.delete('/userall', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query("DELETE from Users where user_role != 'admin'", (err, result) => {

      if (!err) {
        res.send("Deleted all item!")
      } else { console.log(err) }

    });
    pool.releaseConnection(conn)
  })
});

//post one (protected)
router.post('/user', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const params = req.body;

    conn.query('INSERT INTO Users SET ?', params, (err, result) => {

      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });
    pool.releaseConnection(conn)
  })

});

//update one (protected)
router.put('/user', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    const { user_id, password, user_role } = req.body;

    //update name column
    conn.query('UPDATE Users SET user_role = ?, password = ? WHERE user_id = ?', [user_role, password, user_id], (err, result) => {

      if (!err) {
        res.send("Inserted item!")
      } else { console.log(err); }

    });
    pool.releaseConnection(conn)
  })

});

module.exports = router;