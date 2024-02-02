const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const userSignup = require('../modules/user/routes');
const User = require('../modules/user/model');

router.use(
  '/user',
  [
    body('name').trim().not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please add valid email.')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ emailId: value });
        if (userDoc) {
          return Promise.reject('E-Mail address alredy exists');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
  ],
  userSignup
);

module.exports = router;
