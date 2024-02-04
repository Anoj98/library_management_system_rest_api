const express = require('express');
const authController = require('./controller');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/login',
  [
    body('email')
      .isEmail().notEmpty()
      .withMessage('Enter a valid E-mail.')
      .normalizeEmail(),
    body('password').trim().notEmpty(),
  ],
  authController.login
);

module.exports = router;
