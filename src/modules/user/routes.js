const express = require('express');
const userController = require('./controller');
const { body } = require('express-validator');

const User = require('../user/model');
const router = express.Router();
const isAuth = require('../../middlewares/isAuth');

router.put(
  '/signup',
  [
    body('name').trim().notEmpty(),
    body('email')
      .isEmail()
      .notEmpty()
      .withMessage('Please add valid email.')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ authId: value });
        if (userDoc) {
          return Promise.reject('E-Mail address alredy exists');
        }
      })
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .trim()
      .isLength({ min: 5 })
      .withMessage('Please add valid password.'),
  ],  
  userController.signup
);

router.delete('/delete', isAuth, userController.deleteUser);

module.exports = router;
