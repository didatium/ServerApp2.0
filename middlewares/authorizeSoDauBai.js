const { query } = require('../src/db/pool');

/**
 * Authorization middleware for SoDauBai write operations (POST/PUT/DELETE)
 * Expects req.user to be set by auth middleware.
 * Allows:
 *  - admin: always
 *  - admin_khoi: only if req.user.grade_scope === Class.grade for target class_id
 *  - sao_do: only if there exists a Lichtruc row with (week_id, class_active = req.user.user_class, class_passive = class_id)
 *
 * week_id and class_id should be provided in req.body when possible. If only record_id is present
 * in req.params or req.body, the middleware will look up SoDauBai to obtain week_id and class_id.
 * If week_id/class_id cannot be resolved, returns 400.
 */

module.exports = async function authorizeSoDauBai(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required for SoDauBai authorization' });
    }

    const userRole = req.user.role;
    const userGradeScope = req.user.grade_scope;
    const userClass = req.user.user_class;

    // admin always allowed
    if (userRole === 'admin') return next();

    async function resolveWeekAndClass() {
      const body = req.body || {};
      // prefer explicit body values
      if (body.week_id && body.class_id) {
        return { week_id: String(body.week_id), class_id: String(body.class_id) };
      }

      // check params
      if (req.params) {
        if (req.params.week_id && req.params.class_id) {
          return { week_id: String(req.params.week_id), class_id: String(req.params.class_id) };
        }
        if (req.params.record_id) {
          const rows = await query('SELECT week_id, class_id FROM SoDauBai WHERE record_id = ?', [req.params.record_id]);
          if (rows && rows.length > 0) {
            return { week_id: String(rows[0].week_id), class_id: String(rows[0].class_id) };
          }
        }
      }

      // body.record_id as last resort
      if (body.record_id) {
        const rows = await query('SELECT week_id, class_id FROM SoDauBai WHERE record_id = ?', [body.record_id]);
        if (rows && rows.length > 0) {
          return { week_id: String(rows[0].week_id), class_id: String(rows[0].class_id) };
        }
      }

      return null;
    }

    const resolved = await resolveWeekAndClass();

    if (!resolved) {
      return res.status(400).json({ success: false, message: 'Missing week_id and/or class_id in request; required for SoDauBai authorization for this role' });
    }

    const { week_id, class_id } = resolved;

    if (!class_id) return res.status(400).json({ success: false, message: 'class_id is required for SoDauBai authorization' });
    if (!week_id) return res.status(400).json({ success: false, message: 'week_id is required for SoDauBai authorization' });

    if (userRole === 'admin_khoi') {
      const rows = await query('SELECT grade FROM Class WHERE class_id = ?', [class_id]);
      if (!rows || rows.length === 0) {
        return res.status(400).json({ success: false, message: `Class not found for class_id=${class_id}` });
      }
      const classGrade = rows[0].grade;
      if (userGradeScope == null) {
        return res.status(403).json({ success: false, message: 'User has no grade_scope assigned' });
      }
      if (Number(userGradeScope) === Number(classGrade)) return next();
      return res.status(403).json({ success: false, message: 'Forbidden: admin_khoi can only operate on classes in their grade scope' });
    }

    if (userRole === 'sao_do') {
      if (!userClass) {
        return res.status(403).json({ success: false, message: 'Forbidden: sao_do has no assigned user_class' });
      }
      const rows = await query(
        'SELECT 1 FROM Lichtruc WHERE week_id = ? AND class_active = ? AND class_passive = ? LIMIT 1',
        [week_id, userClass, class_id]
      );
      if (rows && rows.length > 0) return next();
      return res.status(403).json({ success: false, message: 'Forbidden: sao_do is not assigned to this duty (Lichtruc row not found)' });
    }

    return res.status(403).json({ success: false, message: 'Forbidden: role not permitted to mutate SoDauBai' });
  } catch (err) {
    console.error('authorizeSoDauBai error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during SoDauBai authorization' });
  }
};
