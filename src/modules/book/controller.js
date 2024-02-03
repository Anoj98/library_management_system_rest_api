const Book = require('./model');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res, next) => {
  const userType = req.userType;
  if (userType !== 'Admin') {
    const error = new Error('Not Authorized');
    error.statusCode = 403;
    return next(error);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation error in creating a book.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  const name = req.body.name;
  const totalCopies = req.body.totalCopies;
  const availableCopies = req.body.availableCopies;

  try {
    // prevent Same book creating

    // const isSame = await Book.findOne({ name: name });
    // console.log(isSame);
    // if (isSame) {
    //   const error = new Error('Already have the same book.');
    //   error.statusCode = 422;
    //   throw error;
    // }

    const book = new Book({
      name: name,
      totalCopies: totalCopies,
      availableCopies: availableCopies,
    });

    const isCreated = await book.save();
    if (isCreated) {
      console.log('The book saved.');
      res.status(201).json({ message: 'The book saved.' });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error("The book didn't save.");
    next(err);
  }
};

exports.deletebook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const userType = req.userType;
  if (userType !== 'Admin') {
    const error = new Error('Not Authorized');
    error.statusCode = 403;
    return next(error);
  }
  
  try {
    const book = await Book.findByIdAndDelete(bookId);
    console.log(book);
    if (!book) {
      const error = new Error("Can't find a book with this id.");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: 'The book is deleted.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error("The book didn't delete.");
    next(err);
  }
};

exports.getbooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      const error = new Error("Can't find any books.");
      throw error;
    }
    res.status(200).json({
      message: 'All the books fetched.',
      books: books,
    });
    console.log('All the books fetched.');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('No books.');
    next(err);
  }
};
