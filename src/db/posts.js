// Filename - posts.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    tripId: {
      type: String,
      required: false,
    },
    locNum: {
      type: Number,
      required: false,
    },
    uid: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    location: {
      type: Object,
      required: true,
    },
    visibility: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    takenDate: {
      type: Date,
      required: false,
    },
    likes: {
      type: [String], // Array of user IDs who liked the post
      default: [], // Initialize as an empty array
    },
  },
  {
    collection: 'posts',
  },
);

const postsCol = mongoose.model('posts', postSchema);

module.exports = postsCol;
