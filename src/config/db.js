const mongoose = require('mongoose');

require('dotenv').config();

// url for the mongoDB database
const mongodbUrl = process.env.DB_CONNECTION_STRING;

const connectToMongodb = async () => {
  try {
    const result = await mongoose.connect(mongodbUrl);
    // console.log(result);
    console.log('Database connection successful.');
  } catch (err) {
    console.error('Database connection error.', err);
  }
};

connectToMongodb();
