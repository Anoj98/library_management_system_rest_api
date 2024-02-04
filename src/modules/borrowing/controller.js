const Borrowing = require('./model');
const User = require('../user/model');
const Book = require('../book/model');

// borrowing books only by regular users
exports.borrowing = async (req, res, next) => {
  const userName = req.user.name;
  const userId = req.user.userId;
  const bookId = req.body._id;
  const bookName = req.body.name;
  const isReturned = false;

  try {
    // check authorisation
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'User') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }

    // check wether able to get the book-id and user-id
    if (!bookId && !userId) {
      const error = new Error("Can't place a borrowing.");
      error.statusCode = 403;
      throw error;
    }

    // check there are any books left to borrow and deduct one from the available copies
    const book = await Book.findById(bookId);
    let availableCopies = parseInt(book.availableCopies, 10);
    if (!(availableCopies > 0)) {
      const error = new Error('No available copies left');
      throw error;
    }
    availableCopies -= 1;

    // update the book in the database with the available copies
    const newBook = await Book.findByIdAndUpdate(
      bookId,
      { availableCopies: availableCopies },
      { new: true }
    );

    // check if there an erro in saving the updated book detailes
    if (!newBook) {
      const error = new Error("couldn't update available copies");
      throw error;
    }

    // create the borrowing mongo object
    const borrow = new Borrowing({
      user: {
        _id: userId,
        name: userName,
      },
      book: {
        _id: bookId,
        name: bookName,
      },
      isReturned: isReturned,
    });

    // save the borrowing in the data base
    const borrowed = await borrow.save();

    // response
    res.status(200).json({
      message: `${bookName} has borrowed by ${userName}`,
      borrowedId: borrowed._id,
    });
    console.log(borrowed);
    console.log(`${bookName} has borrowed by ${userName}`);

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log("Couldn't place a borrowing");
    next(err);
  }
};

// mark returned books only by admins
exports.return = async (req, res, next) => {
  const borrowId = req.body._id;
  try {
    // check authorisation
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'Admin') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }

    // check weather book already returned
    const isReturned = await Borrowing.findById(borrowId);
    if (isReturned.isReturned === true) {
      const error = new Error('The book has already returned');
      throw error;
    }

    // update the borrowing to returned state
    const returnedBorrowing = await Borrowing.findByIdAndUpdate(
      borrowId,
      { isReturned: true },
      { new: true }
    );

    // check the the book details have updated
    if (!returnedBorrowing) {
      const error = new Error("Couldn't save the updated book details.");
      throw error;
    }

    // if its success then add the available copies to the book database
    // get the book id
    const bookId = returnedBorrowing.book._id;
    // find the book
    const book = await Book.findById(bookId);
    let availableCopies = book.availableCopies;
    console.log(availableCopies);
    if (!book) {
      const error = new Error("Couldn't found the book.");
      throw error;
    }
    availableCopies += 1;

    // update the book in the database with the available copies
    const newBook = await Book.findByIdAndUpdate(
      bookId,
      { availableCopies: availableCopies },
      { new: true }
    );

    // check if there an erro in saving the updated book detailes
    if (!newBook) {
      const error = new Error("couldn't update available copies");
      throw error;
    }

    // response
    res.status(200).json({
      message: 'The book have returned.',
      returnedBorrowing: returnedBorrowing._id,
    });
    console.log(returnedBorrowing);
    console.log('The book have returned.');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log("The book didn't return.");
    next(err);
  }
};

// get all the selfe borrowings and active borrowings by the user
exports.getSelfBorrowings = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    // check authorisation
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'User') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      return next(error);
    }

    // fetch all borrowings that belogs to requested body user-id
    const selfAllBorrowings = await Borrowing.find({ 'user._id': userId });
    // fetch all active borrowings bolongs to that same user-id
    const selfActiveBorrowings = await Borrowing.find({
      'user._id': userId,
      isReturned: false,
    });

    // response send both arrays
    res.status(200).json({
      message: 'Fetched all the self borrowings and active self borrowings',
      selfAllborrowings: selfAllBorrowings,
      selfActiveBorrowings: selfActiveBorrowings,
    });
    console.log('Fetched all the self borrowings and active self borrowings');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log("Couldn't fetch the self borrowings");
    next(err);
  }
};

// get all the borrowings and active borrowings only by the admins
exports.getAllBorrowings = async (req, res, next) => {
  try {
    // check authorisation
    const user = await User.findById(req.user.userId);
    const userType = user.type;
    if (userType !== 'Admin') {
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      return next(error);
    }

    // get all the borrowings from every user
    const allBorrowings = await Borrowing.find();
    // get list of active borrowings from all users
    const borrowingsByUser = allBorrowings.reduce((acc, borrowing) => {
      const userId = borrowing.user._id;
    
      if (!acc[userId]) {
        acc[userId] = {
          userId: userId,
          borrowings: [],
          activeBorrowings: [],
        };
      }
    
      acc[userId].borrowings.push(borrowing);
    
      // Check if the borrowing is active and include it in activeBorrowings
      if (!borrowing.isReturned) {
        acc[userId].activeBorrowings.push(borrowing);
      }
    
      return acc;
    }, {});
    
    const userBorrowingsArray = Object.values(borrowingsByUser);
    
    console.log(userBorrowingsArray);

    // response send the both lists
    res.status(200).json({
      message: 'Fetched all the borrowings',
      allBorrowingsByUser: userBorrowingsArray,
    });
    console.log('Fetched all the borrowings and active borrowings');

    // error handling
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log("Couldn't fetch the borrowings");
    next(err);
  }
};
