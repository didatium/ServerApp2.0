const { query } = require('../src/db/pool');

function normalizeRole(role) {
  if (role === 'admin') {
    return { role: 'admin', grade_scope: null };
  }

  const match = /^admin(\d{2})$/.exec(role);
  if (match) {
    return { role: 'admin_khoi', grade_scope: Number(match[1]) };
  }

  if (role === 'Sao đỏ') {
    return { role: 'sao_do', grade_scope: null };
  }

  return null;
}

async function run() {
  console.log('Starting normalization of Users.role and grade_scope...');

  const users = await query('SELECT user_id, role, user_class FROM Users');
  const stats = {
    admin: 0,
    admin_khoi: 0,
    sao_do: 0,
    unchanged: 0
  };
  const unmatched = [];

  for (const user of users) {
    const currentRole = user.role;
    const normalized = normalizeRole(currentRole);

    if (!normalized) {
      unmatched.push({ user_id: user.user_id, role: currentRole });
      continue;
    }

    const { role, grade_scope } = normalized;
    await query('UPDATE Users SET role = ?, grade_scope = ? WHERE user_id = ?', [role, grade_scope, user.user_id]);
    stats[role] += 1;
  }

  console.log('User role normalization completed.');
  console.log('Summary:');
  console.log(`- admin: ${stats.admin}`);
  console.log(`- admin_khoi: ${stats.admin_khoi}`);
  console.log(`- sao_do: ${stats.sao_do}`);
  console.log(`- unmatched / unchanged: ${unmatched.length}`);

  if (unmatched.length > 0) {
    console.log('\nUsers with roles that could not be normalized:');
    unmatched.forEach((item) => {
      console.log(`- ${item.user_id}: role='${item.role}'`);
    });
    console.log('\nThese records were left unchanged for manual review.');
  }

  console.log('\nNext step after verification: alter Users.role to ENUM(\'admin\', \'admin_khoi\', \'sao_do\') and drop user_role when ready.');
}

run().catch((error) => {
  console.error('User role normalization failed:', error);
  process.exit(1);
});
