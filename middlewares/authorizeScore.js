const { query } = require('../src/db/pool');

/**
 * Authorization middleware for Score write operations
 * - admin: always allowed
 * - admin_khoi: allowed only if all target class_id belong to user's grade_scope
 * Expects req.user to be set by auth middleware.
 */
module.exports = async function authorizeScore(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required for Score authorization' });
    }

    const userRole = req.user.role;
    const userGradeScope = req.user.grade_scope;

    if (userRole === 'admin') return next();

    if (userRole === 'admin_khoi') {
      // collect class_ids from request
      const body = req.body || {};
      const classIds = new Set();

      // POST may send array of items
      if (Array.isArray(body)) {
        body.forEach(item => { if (item && item.class_id) classIds.add(String(item.class_id)); });
      } else if (Array.isArray(body.items)) {
        body.items.forEach(item => { if (item && item.class_id) classIds.add(String(item.class_id)); });
      } else {
        if (body.class_id) classIds.add(String(body.class_id));
        if (req.params && req.params.class_id) classIds.add(String(req.params.class_id));
      }

      if (classIds.size === 0) {
        return res.status(400).json({ success: false, message: 'class_id is required for Score authorization' });
      }

      // fetch grades for all classIds
      const ids = Array.from(classIds);
      const placeholders = ids.map(() => '?').join(',');
      const rows = await query(`SELECT class_id, grade FROM Class WHERE class_id IN (${placeholders})`, ids);

      const gradeMap = {};
      rows.forEach(r => { gradeMap[String(r.class_id)] = r.grade; });

      for (const cid of ids) {
        if (!(cid in gradeMap)) {
          return res.status(400).json({ success: false, message: `Class not found for class_id=${cid}` });
        }
        if (userGradeScope == null) {
          return res.status(403).json({ success: false, message: 'User has no grade_scope assigned' });
        }
        if (Number(userGradeScope) !== Number(gradeMap[cid])) {
          return res.status(403).json({ success: false, message: 'Forbidden: admin_khoi can only operate on classes in their grade scope' });
        }
      }

      return next();
    }

    return res.status(403).json({ success: false, message: 'Forbidden: role not permitted to mutate Score' });
  } catch (err) {
    console.error('authorizeScore error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during Score authorization' });
  }
};
