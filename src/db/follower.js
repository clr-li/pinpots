// Filename - follower.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const followerSchema = new Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    followedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    collection: 'follower',
  },
);

const UserRelation = mongoose.model('follower', followerSchema);

module.exports = UserRelation;
