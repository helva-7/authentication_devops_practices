// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorize = require('../middlewares/authorize');

// Only admin can assign roles and activate users
router.post('/assign-role', authorize('admin'), adminController.assignRole);
router.post('/activate-user', authorize('admin'), adminController.activateUser);

module.exports = router;
