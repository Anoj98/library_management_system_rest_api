const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const bookController = require('./controller');
const isAuth = require('../../middlewares/isAuth');

router.post(
  '/create',
  [
    body('name').trim().notEmpty(),
    body('totalCopies')
      .trim()
      .isNumeric()
      .notEmpty()
      .custom((value) => parseInt(value, 10) !== 0)
      .withMessage('The number cannot be zero'),
    body('availableCopies')
      .trim()
      .isNumeric()
      .notEmpty()
      .custom((value) => parseInt(value, 10) !== 0)
      .withMessage('The number cannot be zero'),
  ],
  isAuth,
  bookController.createBook
);

router.delete('/delete-book/:bookId', isAuth, bookController.deletebook);

router.get('/all-books', isAuth, bookController.getbooks);

module.exports = router;
