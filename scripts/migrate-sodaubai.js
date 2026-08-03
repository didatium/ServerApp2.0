const { pool } = require('../src/db/pool');

async function run() {
  const startedAt = new Date();
  console.log(`Starting SoDauBai migration at ${startedAt.toISOString()}`);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      "SELECT vpm_id, week_id, class_id, quantity, name_student, create_by, create_at FROM Vipham WHERE name_student IS NOT NULL AND TRIM(name_student) LIKE '[%';"
    );

    if (rows.length === 0) {
      console.log('No Vipham rows found for SoDauBai migration. Nothing to do.');
      await connection.commit();
      return;
    }

    const vpmIds = [];
    let insertedCount = 0;

    for (const row of rows) {
      const raw = (row.name_student || '').trim();
      let periodsData;
      try {
        periodsData = JSON.parse(raw);
      } catch (error) {
        throw new Error(`Invalid JSON in Vipham.vpm_id=${row.vpm_id}: ${error.message}`);
      }

      if (!Array.isArray(periodsData)) {
        throw new Error(`Vipham.vpm_id=${row.vpm_id} has name_student that parses but is not a JSON array`);
      }

      await connection.execute(
        'INSERT INTO SoDauBai (week_id, class_id, periods_data, quantity, create_by, create_at) VALUES (?, ?, ?, ?, ?, ?)',
        [row.week_id, row.class_id, JSON.stringify(periodsData), row.quantity, row.create_by, row.create_at]
      );

      vpmIds.push(row.vpm_id);
      insertedCount += 1;
    }

    const placeholder = vpmIds.map(() => '?').join(', ');
    const [deleteResult] = await connection.execute(
      `DELETE FROM Vipham WHERE vpm_id IN (${placeholder})`,
      vpmIds
    );

    const deletedCount = deleteResult.affectedRows;
    if (deletedCount !== insertedCount) {
      throw new Error(`Insert/delete count mismatch: inserted=${insertedCount}, deleted=${deletedCount}`);
    }

    await connection.commit();

    const finishedAt = new Date();
    console.log(`SoDauBai migration completed successfully at ${finishedAt.toISOString()}`);
    console.log(`Total rows migrated: ${insertedCount}`);
    console.log(`Duration: ${(finishedAt - startedAt) / 1000}s`);
  } catch (error) {
    await connection.rollback();
    console.error('Migration failed, rolled back transaction. Error:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
  }
}

run().catch((error) => {
  console.error('Unexpected migration failure:', error);
  process.exit(1);
});
