const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const bookController = require('./controller');
const isAuth = require('../../middlewares/isAuth');

router.post(
  '/create',
  [
    body('name').trim().not().isEmpty(),
    body('totalCopies').trim().isNumeric(),
    body('availableCopies').trim().isNumeric(),
  ],
  isAuth,
  bookController.createBook
);

router.delete('/delete-book/:bookId', isAuth, bookController.deletebook);

router.get('/all-books', bookController.getbooks);

module.exports = router;
