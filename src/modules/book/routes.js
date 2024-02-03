const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const bookController = require('./controller');

router.post(
  '/create',
  [
    body('name').trim().not().isEmpty(),
    body('totalCopies').trim().isNumeric(),
    body('availableCopies').trim().isNumeric(),
  ],
  bookController.createBook
);

router.delete('/delete-book/:bookId', bookController.deletebook);

router.get('/all-books', bookController.getbooks);

module.exports = router;
