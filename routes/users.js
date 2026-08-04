const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { query } = require('../src/db/pool');
const { pool } = require("../db/db-config.js");
const requireRole = require('../src/middleware/requireRole');
const auth = require('../src/middleware/auth.middleware');

function generateSecurePassword(length = 10) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join('')
    .slice(0, length);
}

//get all (admin only)
router.get('/userall', auth, requireRole('admin'), (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query('select * from Users', (err, result) => {
      conn.release()
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

  })
});

//get execpt admin (admin only)
router.get('/user', auth, requireRole('admin'), (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {console.log(err)}

    conn.query("select * from Users where user_id != 'ur-adm'", (err, result) => {
      conn.release()
      if (err) {
        console.log(err)
        return
      };
      res.send(result)
    });

  })
});

//get one (admin only)
router.get('/user/:user_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('SELECT * from Users where user_id = ?', [req.params.user_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send(result)
      } else { console.log(err) }

    });

  })

});

//reset password (admin only)
router.post('/user/:user_id/reset-password', auth, requireRole('admin'), async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ success: false, message: 'user_id is required' });
  }

  const newPassword = generateSecurePassword(10);

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const result = await query('UPDATE Users SET password = ? WHERE user_id = ?', [hashed, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, newPassword });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//delete one (protected)
router.delete('/user/:user_id', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query('DELETE from Users where user_id = ?', [req.params.user_id], (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted item!")
      } else { console.log(err) }

    });
    
  })
});

//delete all (protected)
router.delete('/userall', auth, requireRole('admin'), (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err) }

    conn.query("DELETE from Users where user_name != 'admin'", (err, result) => {
      conn.release()
      if (!err) {
        res.send("Deleted all item!")
      } else { console.log(err) }

    });
    
  })
});

//post one (protected)
router.post('/user', auth, requireRole('admin'), async (req, res) => {
  const { user_id, password, user_name, user_class, role } = req.body;
  if (!user_id || !password || !user_name) {
    return res.status(400).json({ success: false, message: 'user_id, password, and user_name are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = {
      user_id,
      password: hashedPassword,
      user_name,
      user_class: user_class || null,
      role: role || null,
    };

    await query('INSERT INTO Users SET ?', params);
    return res.json({ success: true, data: { user_id }, message: 'User created' });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//update one (protected)
router.put('/user', auth, requireRole('admin'), async (req, res) => {
  const { user_id, password, user_name, user_class, role } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, message: 'user_id is required' });
  }

  try {
    const fields = [];
    const values = [];

    if (user_name !== undefined) {
      fields.push('user_name = ?');
      values.push(user_name);
    }
    if (user_class !== undefined) {
      fields.push('user_class = ?');
      values.push(user_class);
    }
    if (role !== undefined) {
      fields.push('role = ?');
      values.push(role);
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one field to update must be provided' });
    }

    values.push(user_id);
    const sql = `UPDATE Users SET ${fields.join(', ')} WHERE user_id = ?`;
    const result = await query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User updated' });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// update own profile (authenticated user only)
// Allows changing password and user_class for the current user (no role change allowed)
router.put('/user/me', auth, async (req, res) => {
  try {
    const userId = req.user && req.user.user_id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { password, user_id } = req.body;
    if (password === undefined && user_id === undefined) {
      return res.status(400).json({ success: false, message: 'At least one of password or user_id must be provided' });
    }

    const fields = [];
    const values = [];

    if (password !== undefined) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    values.push(userId);
    const sql = `UPDATE Users SET ${fields.join('')} WHERE user_id = ?`;
    const result = await query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Update self error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;