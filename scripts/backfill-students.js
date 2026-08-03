const { query } = require('../src/db/pool');

async function run() {
  console.log('Starting backfill of Student records from Vipham...');

  const distinctPairs = await query(
    'SELECT DISTINCT name_student, class_id FROM Vipham WHERE name_student IS NOT NULL AND name_student <> ""'
  );

  const unmatched = [];
  const createdStudents = [];

  for (const row of distinctPairs) {
    const name_student = String(row.name_student || '').trim();
    const class_id = row.class_id;

    if (!name_student || !class_id) {
      unmatched.push({ name_student, class_id, reason: 'Missing name_student or class_id' });
      continue;
    }

    const classes = await query('SELECT class_id FROM Class WHERE class_id = ?', [class_id]);
    if (classes.length === 0) {
      unmatched.push({ name_student, class_id, reason: 'Class not found' });
      continue;
    }

    const existingStudent = await query(
      'SELECT student_id FROM Student WHERE student_name = ? AND class_id = ?',
      [name_student, class_id]
    );

    let studentId;
    if (existingStudent.length > 0) {
      studentId = existingStudent[0].student_id;
    } else {
      const insertResult = await query(
        'INSERT INTO Student (student_id, student_name, class_id) VALUES (UUID(), ?, ?)',
        [name_student, class_id]
      );
      studentId = insertResult.insertId ? insertResult.insertId : null;

      if (!studentId) {
        const rows = await query('SELECT student_id FROM Student WHERE student_name = ? AND class_id = ?', [name_student, class_id]);
        studentId = rows[0] && rows[0].student_id ? rows[0].student_id : null;
      }

      if (studentId) {
        createdStudents.push({ student_id: studentId, student_name, class_id });
      }
    }

    if (studentId) {
      await query(
        'UPDATE Vipham SET student_id = ? WHERE name_student = ? AND class_id = ? AND (student_id IS NULL OR student_id = "")',
        [studentId, name_student, class_id]
      );
    }
  }

  console.log('Backfill completed.');
  console.log(`Created ${createdStudents.length} students.`);
  if (unmatched.length > 0) {
    console.log('Unmatched entries:');
    unmatched.forEach((item) => {
      console.log(`- name_student=${item.name_student || '<empty>'}, class_id=${item.class_id || '<empty>'}, reason=${item.reason}`);
    });
  } else {
    console.log('No unmatched entries found.');
  }
}

run().catch((error) => {
  console.error('Backfill script failed:', error);
  process.exit(1);
});
