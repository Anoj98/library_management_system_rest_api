const User = require('./model');
const Auth = require('../auth/model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const type = 'User';

  try {
    const hashedPW = await bcrypt.hash(password, 12);
    const auth = new Auth({
      emailId: email,
      password: hashedPW,
    });
    const resultAuth = await auth.save();
    // if authe saved succe
    if (resultAuth) {
      const user = new User({
        authId: auth.emailId,
        name: name,
        type: type,
      });
      const resultUser = await user.save();
    }
    res.status(201).json({ message: 'Successfully created a user.' });
    console.log('Successfully created a user.');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to created a user.');
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.body._id;
    const user = await User.findById(userId);
    const authResult = await Auth.findOneAndDelete({ emailId: user.authId });
    if (!authResult) {
      const error = new Error('Failed to delete a user.');      
      throw error;
    }
    await user.deleteOne();
    res.status(200).json({ message: 'Successfully deleted a user.' });
    console.log('Successfully deleted a user.');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      console.error('Failed to delete a user.');
      next(err);
    }
  }
};
