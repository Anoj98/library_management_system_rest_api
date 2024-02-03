const Auth = require('../auth/model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const auth = await Auth.findOne({ emailId: email });
    console.log(auth);
    if (!auth) {
      const error = new Error("Can't find a matching email.");
      error.statusCode = 401;
      throw error;
    }

    const paswordCheck = await bcrypt.compare(password, auth.password);
    
    if (!paswordCheck) {

      const error = new Error('Password not matching with the email.');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ message: 'You have loged in successfully.' });
    console.log('You have loged in successfully.');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to Login.');
    next(err);
  }
};
