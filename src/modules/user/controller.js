const User = require('./model');
const Auth = require('../auth/model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// signup users only by regular users
exports.signup = async (req, res, next) => {
  // chack validations of the input values
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error in creating a user.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const type = 'User';

  try {
    // hashed the password
    const hashedPW = await bcrypt.hash(password, 12);
    // create new auth
    const auth = new Auth({
      emailId: email,
      password: hashedPW,
    });

    // save the auth mongoose object
    const resultAuth = await auth.save();
    // check auth saved then save the new user
    let resultUser;
    if (resultAuth) {
      const user = new User({
        authId: auth.emailId,
        name: name,
        type: type,
      });
      resultUser = await user.save();
    }

    // response
    res.status(201).json({
      message: 'Successfully created a user.',
      userId: resultUser._id,
      authId: resultAuth._id,
    });
    console.log('Successfully created a user.');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to created a user.');
    next(err);
  }
};

// to delete a user only by admins
exports.deleteUser = async (req, res, next) => {
  try {
    // check the authorzation
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'Admin') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      return next(error);
    }

    // fetch the user from request body user-id
    const userId = req.body._id;
    const selectedUser = await User.findById(userId);
    // fetch the auth and delete from the fetched user
    const authResult = await Auth.findOneAndDelete({
      emailId: selectedUser.authId,
    });
    // check auth has deleted
    if (!authResult) {
      const error = new Error('Failed to delete a user.');
      throw error;
    }
    // delete the user
    const deletedOne = await selectedUser.deleteOne();

    // response
    res
      .status(200)
      .json({ message: 'Successfully deleted a user.', deleted: deletedOne._id });
    console.log('Successfully deleted a user.');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('Failed to delete a user.');
    next(err);
  }
};
