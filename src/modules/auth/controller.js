const Auth = require('../auth/model');
const User = require('../user/model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error in authenticating a user.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  try {
    const auth = await Auth.findOne({ emailId: email });
    const user = await User.findOne({ authId: email });
    // check Email
    if (!auth && !user) {
      const error = new Error("Can't find a matching email.");
      error.statusCode = 401;
      throw error;
    }
    const paswordCheck = await bcrypt.compare(password, auth.password);
    // check password
    if (!paswordCheck) {
      const error = new Error('Password not matching with the email.');
      error.statusCode = 401;
      throw error;
    }
    
    const token = jwt.sign(
      {
        email: email,
        type: user.type,
        _id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res
      .status(200)
      .header('Authorization', `Bearer ${token}`)
      .json({ message: 'You have loged in successfully.' });
    console.log('You have loged in successfully.');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to Login.');
    next(err);
  }
};
