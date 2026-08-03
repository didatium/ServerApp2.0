const { query } = require('../src/db/pool');

function parseClassGrade(classId) {
  if (typeof classId !== 'string') return null;
  if (classId.length !== 7) return null;
  const match = /^cls(\d{2})[A-Za-z]\d$/i.exec(classId);
  if (!match) return null;
  const grade = Number(match[1]);
  return Number.isNaN(grade) ? null : grade;
}

async function run() {
  console.log('Starting backfill of Class.grade from Class.class_id...');

  const classes = await query('SELECT class_id FROM Class');
  const invalid = [];
  const updated = [];

  for (const row of classes) {
    const classId = row.class_id;
    const grade = parseClassGrade(classId);

    if (grade === null) {
      invalid.push({ class_id: classId });
      continue;
    }

    await query('UPDATE Class SET grade = ? WHERE class_id = ?', [grade, classId]);
    updated.push({ class_id: classId, grade });
  }

  console.log('Class grade backfill completed.');
  console.log(`Updated ${updated.length} class records.`);
  if (updated.length > 0) {
    console.log('Updated classes:');
    updated.forEach(({ class_id, grade }) => {
      console.log(`- ${class_id}: grade=${grade}`);
    });
  }

  if (invalid.length > 0) {
    console.log(`\nFound ${invalid.length} class records with unexpected class_id format. These were NOT updated:`);
    invalid.forEach(({ class_id }) => {
      console.log(`- ${class_id}`);
    });
  } else {
    console.log('No invalid class_id formats found.');
  }
}

run().catch((error) => {
  console.error('Class grade backfill failed:', error);
  process.exit(1);
});
