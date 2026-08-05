const userService = require('../services/userService');
const crypto = require('crypto');
const { createUserValidator, updateUserValidator } = require('../utils/validators')

function generateSecurePassword(length = 10) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join('')
    .slice(0, length);
}

async function listAllUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function listUsersExceptAdmin(req, res, next) {
  try {
    const users = await userService.listUsersExceptAdmin();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { user_id } = req.params;
    const user = await userService.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    const newPassword = generateSecurePassword(10);
    const result = await userService.resetPassword(user_id, newPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await userService.removeUser(user_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'Deleted user!' });
  } catch (err) {
    next(err);
  }
}

async function deleteAllUsers(req, res, next) {
  try {
    await userService.removeAllNonAdmin();
    return res.status(200).json({ success: true, message: 'Deleted all users!' });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { user_id, password, user_name, user_class, role } = createUserValidator(req.body);
    if (!user_id || !password || !user_name) {
      return res.status(400).json({ success: false, message: 'user_id, password, and user_name are required' });
    }

    await userService.createUser({ user_id, password, user_name, user_class, role });
    return res.status(201).json({ success: true, data: { user_id }, message: 'User created' });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { user_id, password, user_name, user_class, role } = updateUserValidator(req.body);
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required' });
    }

    if (password === undefined && user_name === undefined && user_class === undefined && role === undefined) {
      return res.status(400).json({ success: false, message: 'At least one field to update must be provided' });
    }

    const result = await userService.updateUser({ user_id, password, user_name, user_class, role });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User updated' });
  } catch (err) {
    next(err);
  }
}

async function updateOwnProfile(req, res, next) {
  try {
    const userId = req.user && req.user.user_id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { password, user_class } = req.body;
    if (password === undefined && user_class === undefined) {
      return res.status(400).json({ success: false, message: 'At least one of password or user_class must be provided' });
    }

    const result = await userService.updateOwnProfile(userId, { password, user_class });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAllUsers,
  listUsersExceptAdmin,
  getUser,
  resetPassword,
  deleteUser,
  deleteAllUsers,
  createUser,
  updateUser,
  updateOwnProfile
};
