const { query } = require('../db/pool');

async function getAllUsers() {
  return query('SELECT * FROM Users');
}

async function getUsersExceptAdmin() {
  return query("SELECT * FROM Users WHERE user_id != 'ur-adm'");
}

async function getUserById(userId) {
  const rows = await query('SELECT * FROM Users WHERE user_id = ?', [userId]);
  return rows[0] || null
}

async function updateUserPassword(userId, passwordHash) {
  return query('UPDATE Users SET password = ? WHERE user_id = ?', [passwordHash, userId]);
}

async function deleteUserById(userId) {
  return query('DELETE FROM Users WHERE user_id = ?', [userId]);
}

async function deleteAllNonAdmin() {
  return query("DELETE FROM Users WHERE user_name != 'admin'");
}

async function createUser(userData) {
  return query('INSERT INTO Users SET ?', userData);
}

async function updateUserById(userId, fields) {
  const updates = [];
  const values = [];

  if (fields.user_name !== undefined) {
    updates.push('user_name = ?');
    values.push(fields.user_name);
  }
  if (fields.user_class !== undefined) {
    updates.push('user_class = ?');
    values.push(fields.user_class);
  }
  if (fields.role !== undefined) {
    updates.push('role = ?');
    values.push(fields.role);
  }
  if (fields.password !== undefined) {
    updates.push('password = ?');
    values.push(fields.password);
  }

  if (updates.length === 0) {
    return { affectedRows: 0 };
  }

  values.push(userId);
  const sql = `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`;
  return query(sql, values);
}

module.exports = {
  getAllUsers,
  getUsersExceptAdmin,
  getUserById,
  updateUserPassword,
  deleteUserById,
  deleteAllNonAdmin,
  createUser,
  updateUserById
};
