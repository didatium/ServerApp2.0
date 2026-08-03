const CryptoES = require('crypto-es');
const bcrypt = require('bcryptjs');
const { query } = require('../src/db/pool');

async function run() {
  console.log('Starting password migration: AES -> bcrypt');
  const users = await query('SELECT user_id, password, user_role FROM Users');

  let success = 0;
  const failures = [];

  for (const u of users) {
    const { user_id, password: encrypted, user_role } = u;
    if (!encrypted) {e
      failures.push({ user_id, reason: 'empty password' });
      continue;
    }

    // key is user_role per your confirmation
    const key = user_role;
    console.log(user_role);
    let plain;
    try {
      plain = CryptoES.AES.decrypt(encrypted, key).toString(CryptoES.enc.Utf8);
    } catch (err) {
      failures.push({ user_role, reason: `decrypt error: ${err.message}` });
      continue;
    }

    if (!plain) {
      failures.push({ user_id, reason: 'decrypt produced empty string' });
      continue;
    }

    try {
      const hash = await bcrypt.hash(plain, 10);
      await query('UPDATE Users SET password = ? WHERE user_id = ?', [hash, user_id]);
      success += 1;
    } catch (err) {
      failures.push({ user_id, reason: `hash/update error: ${err.message}` });
      continue;
    }
  }

  console.log('Password migration complete.');
  console.log(`Total users processed: ${users.length}`);
  console.log(`Successfully migrated: ${success}`);
  console.log(`Failures: ${failures.length}`);
  if (failures.length > 0) console.log('Failed records:', failures);
}

run().catch(err => {
  console.error('Migration script failed unexpectedly:', err);
  process.exit(1);
});
