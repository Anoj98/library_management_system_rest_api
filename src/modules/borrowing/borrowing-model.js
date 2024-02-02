const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowingSchema = new Schema({
  user: {
    _id: Schema.Types.ObjectId,
    ref: 'User',
    name: String,
  },
  book: {
    _id: Schema.Types.ObjectId,
    ref: 'Book',
    name: String,
  },
  isReturned: Boolean,
});

module.exports = mongoose.model('Borrowings', borrowingSchema);