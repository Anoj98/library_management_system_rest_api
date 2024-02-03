const express = require('express');
const userController = require('./controller');
const { body } = require('express-validator');

const User = require('../user/model');
const router = express.Router();

router.put(
  '/signup',
  [
    body('name').trim().not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please add valid email.')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ authId: value });
        if (userDoc) {
          return Promise.reject('E-Mail address alredy exists');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }).withMessage('Please add valid password.'),
  ],
  userController.signup
);

router.delete('/delete', userController.deleteUser);

module.exports = router;
