const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const auth = require('../src/middleware/auth.middleware');
const requireRole = require('../src/middleware/requireRole');

//get all (admin only)
router.get('/userall', auth, requireRole('admin'), userController.listAllUsers);

//get execpt admin (admin only)
router.get('/user', auth, requireRole('admin'), userController.listUsersExceptAdmin);

//get one (admin only)
router.get('/user/:user_id', auth, requireRole('admin'), userController.getUser);

//reset password (admin only)
router.post('/user/:user_id/reset-password', auth, requireRole('admin'), userController.resetPassword);

//delete one (protected)
router.delete('/user/:user_id', auth, requireRole('admin'), userController.deleteUser);

//delete all (protected)
router.delete('/userall', auth, requireRole('admin'), userController.deleteAllUsers);

//post one (protected)
router.post('/user', auth, requireRole('admin'), userController.createUser);

//update one (protected)
router.put('/user', auth, requireRole('admin'), userController.updateUser);

// update own profile (authenticated user only)
// Allows changing password and user_class for the current user (no role change allowed)
router.put('/user/me', auth, userController.updateOwnProfile);

module.exports = router;
