const { query, pool } = require('../db/pool');

async function findByClassAndWeek(class_id, week_id) {
  const rows = await query(
    `SELECT
       v.*,
       JSON_ARRAYAGG(
         CASE WHEN s.student_id IS NOT NULL
           THEN JSON_OBJECT(
             'student_id', s.student_id,
             'student_name', s.student_name
           )
           ELSE NULL
         END
       ) AS students
     FROM Vipham v
     LEFT JOIN ViphamStudent vs ON v.vpm_id = vs.vpm_id
     LEFT JOIN Student s ON vs.student_id = s.student_id
     WHERE v.class_id = ? AND v.week_id = ?
     GROUP BY v.vpm_id`,
    [class_id, week_id]
  );
  // Lọc NULL ra khỏi mảng students (LEFT JOIN trả NULL khi không có học sinh)
  return rows.map(row => ({
    ...row,
    students: (row.students ?? []).filter(Boolean),
  }));
}

async function findByWeek(weekId) {
  const rows = await query(
    `SELECT
       v.*,
       JSON_ARRAYAGG(
         CASE WHEN s.student_id IS NOT NULL
           THEN JSON_OBJECT(
             'student_id', s.student_id,
             'student_name', s.student_name
           )
           ELSE NULL
         END
       ) AS students
     FROM Vipham v
     LEFT JOIN ViphamStudent vs ON v.vpm_id = vs.vpm_id
     LEFT JOIN Student s ON vs.student_id = s.student_id
     WHERE v.week_id = ?
     GROUP BY v.vpm_id`,
    [weekId]
  );
  // Lọc NULL ra khỏi mảng students (LEFT JOIN trả NULL khi không có học sinh)
  return rows.map(row => ({
    ...row,
    students: (row.students ?? []).filter(Boolean),
  }));
}

async function findByClass(classId) {
  const rows = await query(
    `SELECT
       v.*,
       JSON_ARRAYAGG(
         CASE WHEN s.student_id IS NOT NULL
           THEN JSON_OBJECT(
             'student_id', s.student_id,
             'student_name', s.student_name
           )
           ELSE NULL
         END
       ) AS students
     FROM Vipham v
     LEFT JOIN ViphamStudent vs ON v.vpm_id = vs.vpm_id
     LEFT JOIN Student s ON vs.student_id = s.student_id
     WHERE v.class_id = ?
     GROUP BY v.vpm_id`,
    [classId]
  );
  // Lọc NULL ra khỏi mảng students (LEFT JOIN trả NULL khi không có học sinh)
  return rows.map(row => ({
    ...row,
    students: (row.students ?? []).filter(Boolean),
  }));
}

async function findById(vpmId) {
  const rows = await query('SELECT * FROM Vipham WHERE vpm_id = ?', [vpmId]);
  return rows[0] || null;
}

async function deleteById(vpmId) {
  return query('DELETE FROM Vipham WHERE vpm_id = ?', [vpmId]);
}

async function deleteByClass(classId) {
  return query('DELETE FROM Vipham WHERE class_id = ?', [classId]);
}

async function deleteAll() {
  return query('DELETE FROM Vipham');
}

async function createVipham({ week_id, class_id, name_vp_id, quantity,
                               create_by, day, bonus, student_ids = [] }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO Vipham (week_id, class_id, name_vp_id, quantity, create_by, day, bonus)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [week_id, class_id, name_vp_id, quantity, create_by, day, bonus ?? null]
    );
    const vpm_id = result.insertId;

    if (student_ids.length > 0) {
      const rows = student_ids.map(sid => [vpm_id, sid]);
      await conn.execute(
        `INSERT INTO ViphamStudent (vpm_id, student_id) VALUES ?`,
        [rows]
      );
    }

    await conn.commit();
    return { vpm_id };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateVipham({ vpm_id, name_vp_id, quantity,
                               modified_by, day, student_ids = [] }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE Vipham SET name_vp_id=?, quantity=?, modified_by=?, day=?
       WHERE vpm_id=?`,
      [name_vp_id, quantity, modified_by, day, vpm_id]
    );

    // Xoá liên kết cũ, insert lại — đơn giản hơn diff và đủ dùng ở quy mô này
    await conn.execute(`DELETE FROM ViphamStudent WHERE vpm_id=?`, [vpm_id]);
    if (student_ids.length > 0) {
      const rows = student_ids.map(sid => [vpm_id, sid]);
      await conn.execute(
        `INSERT INTO ViphamStudent (vpm_id, student_id) VALUES ?`,
        [rows]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateViphamBonus({ vpm_id, bonus, quantity, create_by, day }) {
  return query('UPDATE Vipham SET bonus = ?, quantity = ?, create_by = ?, day = ? WHERE vpm_id = ?', [bonus, quantity, create_by, day, vpm_id]);
}

module.exports = {
  findByClassAndWeek,
  findByWeek,
  findByClass,
  findById,
  deleteById,
  deleteByClass,
  deleteAll,
  createVipham,
  updateVipham,
  updateViphamBonus
};