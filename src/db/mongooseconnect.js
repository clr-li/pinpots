const mongoose = require('mongoose');
require('dotenv').config();

const mongoPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://pinpots:${mongoPassword}@cluster0.ch5rq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connect to MongoDB successfully');
  } catch (error) {
    console.log('Connect failed ' + error.message);
  }
};

module.exports = connectDB;
