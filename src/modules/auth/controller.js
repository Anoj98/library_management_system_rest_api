const Auth = require('../auth/model');
const User = require('../user/model');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// to login anyone and give a jwt
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error in authenticating a user.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    // check Email avalable in the database
    const auth = await Auth.findOne({ emailId: email });
    const user = await User.findOne({ authId: email });    
    if (!auth && !user) {
      const error = new Error("Can't find a matching email.");
      error.statusCode = 401;
      throw error;
    }

    // check password is correct of wrong
    const paswordCheck = await bcrypt.compare(password, auth.password);    
    if (!paswordCheck) {
      const error = new Error('Password not matching with the email.');
      error.statusCode = 401;
      throw error;
    }

    // creating a new token
    const token = jwt.sign(
      {
        name: user.name,
        type: user.type,
        _id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // adding the token and send the response
    res
      .status(200)
      .header('Authorization', `Bearer ${token}`)
      .json({ message: `You have loged in successfully as ${user.type}.`, userId: user._id });
    console.log(`You have loged in successfully as ${user.type}.`);

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to Login.');
    next(err);
  }
};
