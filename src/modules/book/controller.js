const { validationResult } = require('express-validator');
const User = require('../user/model');
const Book = require('./model');

// to create books by admins
exports.createBook = async (req, res, next) => {
  try {
    // check authorization
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'Admin') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }

    // check input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('validation error in creating a book.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const name = req.body.name;
    const totalCopies = req.body.totalCopies;
    const availableCopies = req.body.availableCopies;

    // prevent creating the same book

    // const isSame = await Book.findOne({ name: name });
    // console.log(isSame);
    // if (isSame) {
    //   const error = new Error('Already have the same book.');
    //   error.statusCode = 422;
    //   throw error;
    // }

    // create new book mongo object
    const book = new Book({
      name: name,
      totalCopies: totalCopies,
      availableCopies: availableCopies,
    });

    // save the book in the database
    const createdBook = await book.save();
    // response only after saved the file
    if (createdBook) {
      console.log('The book saved.');
      res.status(201).json({ message: 'The book saved.', bookId: createdBook._id });
    }

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error("The book didn't save.");
    next(err);
  }
};

// delete any book by any admin
exports.deletebook = async (req, res, next) => {
  const bookId = req.params.bookId;
  try {
    // check the authorization
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'Admin') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }

    // fetch and delete the book with the requested book-id
    const book = await Book.findByIdAndDelete(bookId);
    // check the book has deleted
    if (!book) {
      const error = new Error("Can't find a book with this id.");
      error.statusCode = 422;
      throw error;
    }

    // response
    res.status(200).json({ message: 'The book is deleted.', deleted: book });
    console.log('The book is deleted.');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error("The book didn't delete.");
    next(err);
  }
};

// fetch all the books
exports.getbooks = async (req, res, next) => {
  try {
    // fetch books from the database
    const books = await Book.find();
    // check feched books
    if (books.length === 0) {
      const error = new Error("Can't find any books.");
      throw error;
    }

    // response withh all the books
    res.status(200).json({
      message: 'All the books fetched.',
      books: books,
    });
    console.log('All the books fetched.');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.error('No books.');
    next(err);
  }
};
