const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  authId: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
