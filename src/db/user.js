// Filename - user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true, // Index for text search
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
  },
);

// Create a text index on the username field
userSchema.index({ username: 'text' });

const userCol = mongoose.model('users', userSchema);

module.exports = userCol;
