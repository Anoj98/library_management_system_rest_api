const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/routes');
const authRoutes = require('../modules/auth/routes');
const bookRoutes = require('../modules/book/routes');

// /user/signup
// /user/delete
router.use('/user', userRoutes);

// /auth/login
router.use('/auth', authRoutes);

// /book/create
// /book/delete-book/:bookId
// /book/all-books
router.use('/book', bookRoutes);



module.exports = router;
