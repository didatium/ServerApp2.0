const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');

async function authenticateByUserName(userName, password) {
  // fetch user by id
  const rows = await query(
    'SELECT * FROM Users WHERE user_name = ?',
    [userName]
  );
  const user = rows[0];
  if (!user) return null;

  const hash = user.password;
  const match = await bcrypt.compare(password, hash);
  if (!match) return null;

  return {
    user_id: user.user_id,
    user_name: user.user_name,
    role: user.role,
    user_class: user.user_class,
    grade_scope: user.grade_scope
  };
}

module.exports = {
  authenticateByUserName
};
