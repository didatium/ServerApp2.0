const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

async function listUsers() {
  return userRepository.getAllUsers();
}

async function listUsersExceptAdmin() {
  return userRepository.getUsersExceptAdmin();
}

async function findUserById(userId) {
  return userRepository.getUserById(userId);
}

async function resetPassword(userId, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 10);
  return userRepository.updateUserPassword(userId, hashed);
}

async function removeUser(userId) {
  return userRepository.deleteUserById(userId);
}

async function removeAllNonAdmin() {
  return userRepository.deleteAllNonAdmin();
}

async function createUser({ user_id, password, user_name, user_class, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const params = {
    user_id,
    password: hashedPassword,
    user_name,
    user_class: user_class || null,
    role: role || null
  };
  return userRepository.createUser(params);
}

async function updateUser({ user_id, password, user_name, user_class, role }) {
  const fields = {
    user_name,
    user_class,
    role
  };

  if (password !== undefined) {
    fields.password = await bcrypt.hash(password, 10);
  }

  return userRepository.updateUserById(user_id, fields);
}

async function updateOwnProfile(userId, { password, user_class }) {
  const fields = {};
  if (password !== undefined) {
    fields.password = await bcrypt.hash(password, 10);
  }
  if (user_class !== undefined) {
    fields.user_class = user_class;
  }
  return userRepository.updateUserById(userId, fields);
}

module.exports = {
  listUsers,
  listUsersExceptAdmin,
  findUserById,
  resetPassword,
  removeUser,
  removeAllNonAdmin,
  createUser,
  updateUser,
  updateOwnProfile
};
