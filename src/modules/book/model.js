const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  totalCopies: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Book', bookSchema);