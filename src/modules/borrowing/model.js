const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowingSchema = new Schema({
  user: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
  },
  book: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    name: { type: String, required: true },
  },
  isReturned: { type: Boolean, required: true },
});

module.exports = mongoose.model('Borrowing', borrowingSchema);
