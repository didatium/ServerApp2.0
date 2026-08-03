const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');

async function authenticateByUserId(userId, password) {
  // fetch user by id
  const rows = await query('SELECT user_id, password, role AS role, user_class FROM Users WHERE user_id = ?', [userId]);
  const user = rows[0];
  if (!user) return null;

  const hash = user.password;
  const match = await bcrypt.compare(password, hash);
  if (!match) return null;
  // return minimal user info
  return { user_id: user.user_id, role: user.role, user_class: user.user_class };
}

module.exports = {
  authenticateByUserId
};
