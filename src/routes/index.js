const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/routes');
const authRoutes = require('../modules/auth/routes');

// /user/signup
// /user/delete
router.use('/user', userRoutes);

// /auth/login
router.use('/auth', authRoutes);

module.exports = router;
