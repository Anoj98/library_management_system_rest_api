const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
  // put email as the id
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Auth', authSchema);