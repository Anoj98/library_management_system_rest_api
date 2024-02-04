const express = require('express');
const router = express.Router();
const isAuth = require('../../middlewares/isAuth');
const borrowController = require('./controller');

router.put('/borrow', isAuth, borrowController.borrowing);

router.patch('/return', isAuth, borrowController.return);

router.get('/self-borrowings', isAuth, borrowController.getSelfBorrowings);

router.get('/all-borrowings', isAuth, borrowController.getAllBorrowings);

module.exports = router;