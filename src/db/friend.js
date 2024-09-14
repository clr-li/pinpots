// Filename - friend.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    requestedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    collection: 'friend',
  },
);

const FriendRelation = mongoose.model('friend', friendSchema);

module.exports = FriendRelation;
