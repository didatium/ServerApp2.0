const { query } = require('../src/db/pool');

/**
 * Authorization middleware for Vipham write operations (POST/PUT/DELETE)
 * Expects req.user to be set by auth middleware.
 * Allows:
 *  - admin: always
 *  - admin_khoi: only if req.user.grade_scope === Class.grade for target class_id
 *  - sao_do: only if there exists a Lichtruc row with (week_id, class_active = req.user.user_class, class_passive = class_id)
 *
 * If week_id/class_id are missing when needed, returns 400 with an explicit message.
 */
module.exports = async function authorizeVipham(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required for Vipham authorization' });
    }

    const userRole = req.user.role;
    const userGradeScope = req.user.grade_scope;
    const userClass = req.user.user_class;

    // admin has full access regardless of payload
    if (userRole === 'admin') return next();

    // helper to obtain week_id/class_id from request or by looking up Vipham by vpm_id
    async function resolveWeekAndClass() {
      // prefer explicit body values
      const body = req.body || {};
      if (body.week_id && body.class_id) {
        return { week_id: String(body.week_id), class_id: String(body.class_id) };
      }

      // check params for possible values
      if (req.params) {
        if (req.params.week_id && req.params.class_id) {
          return { week_id: String(req.params.week_id), class_id: String(req.params.class_id) };
        }
        if (req.params.vpm_id) {
          const rows = await query('SELECT week_id, class_id FROM Vipham WHERE vpm_id = ?', [req.params.vpm_id]);
          if (rows && rows.length > 0) {
            return { week_id: String(rows[0].week_id), class_id: String(rows[0].class_id) };
          }
        }
        if (req.params.class_id && body.week_id) {
          return { week_id: String(body.week_id), class_id: String(req.params.class_id) };
        }
      }

      // as last resort, if body has vpm_id
      if (body.vpm_id) {
        const rows = await query('SELECT week_id, class_id FROM Vipham WHERE vpm_id = ?', [body.vpm_id]);
        if (rows && rows.length > 0) {
          return { week_id: String(rows[0].week_id), class_id: String(rows[0].class_id) };
        }
      }

      return null;
    }

    const resolved = await resolveWeekAndClass();

    // For non-admin roles, week_id and class_id are required to evaluate permissions
    if (!resolved) {
      return res.status(400).json({ success: false, message: 'Missing week_id and/or class_id in request; required for Vipham authorization for this role' });
    }

    const { week_id, class_id } = resolved;

    if (!class_id) {
      return res.status(400).json({ success: false, message: 'class_id is required for Vipham authorization' });
    }

    if (!week_id) {
      return res.status(400).json({ success: false, message: 'week_id is required for Vipham authorization' });
    }

    if (userRole === 'admin_khoi') {
      // fetch class.grade
      const rows = await query('SELECT grade FROM Class WHERE class_id = ?', [class_id]);
      if (!rows || rows.length === 0) {
        return res.status(400).json({ success: false, message: `Class not found for class_id=${class_id}` });
      }
      const classGrade = rows[0].grade;
      // strict equality: user's grade_scope must equal class.grade
      if (userGradeScope == null) {
        return res.status(403).json({ success: false, message: 'User has no grade_scope assigned' });
      }
      if (Number(userGradeScope) === Number(classGrade)) {
        return next();
      }
      return res.status(403).json({ success: false, message: 'Forbidden: admin_khoi can only operate on classes in their grade scope' });
    }

    if (userRole === 'sao_do') {
      if (!userClass) {
        return res.status(403).json({ success: false, message: 'Forbidden: sao_do has no assigned user_class' });
      }
      // check Lichtruc existence
      const rows = await query(
        'SELECT 1 FROM Lichtruc WHERE week_id = ? AND class_active = ? AND class_passive = ? LIMIT 1',
        [week_id, userClass, class_id]
      );
      if (rows && rows.length > 0) {
        return next();
      }
      return res.status(403).json({ success: false, message: 'Forbidden: sao_do is not assigned to this duty (Lichtruc row not found)' });
    }

    // any other role -> forbidden
    return res.status(403).json({ success: false, message: 'Forbidden: role not permitted to mutate Vipham' });
  } catch (err) {
    console.error('authorizeVipham error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during Vipham authorization' });
  }
};
