// Filename - follower.js
const mongoose = require('mongoose');
require('dotenv').config();
const mongoPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://pinpots:${mongoPassword}@pinpotscluster0.ch5rq.mongodb.net/pinpots-db?retryWrites=true&w=majority&appName=PinpotsCluster0`;

mongoose
    .connect(uri)
    .then(() => {})
    .catch(e => {
        console.log('Connection error:', e);
    });

const followerSchema = new mongoose.Schema(
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
