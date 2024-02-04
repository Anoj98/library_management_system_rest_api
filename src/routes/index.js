const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/user/routes');
const authRoutes = require('../modules/auth/routes');
const bookRoutes = require('../modules/book/routes');
const borrowingRoutes = require('../modules/borrowing/routes');

// /user/signup
// /user/delete
router.use('/user', userRoutes);

// /auth/login
router.use('/auth', authRoutes);

// /book/create
// /book/delete-book/:bookId
// /book/all-books
router.use('/book', bookRoutes);

// /borrowing/borrow
// /borrowing/return
// /borrowing/self-borrowings
// /borrowing/all-borrowings
router.use('/borrowing',borrowingRoutes);



module.exports = router;
