const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userCol = require('./db/user');
const postsCol = require('./db/posts');
const followCol = require('./db/follower');
const levenshtein = require('js-levenshtein');
require('dotenv').config();
const { TOP_POST_LIKES_THRESHOLD, HOSTNAME } = require('./constants');

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: HOSTNAME,
};

app.use(cors(corsOptions));

const port = 10000;

const JWT_SECRET = process.env.JWT_SECRET;

//TODO: HIGH PRIORITY - require authentication for endpoints

// Helper function to generate JWT
function generateToken(user) {
    return jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
    });
}

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userCol.findOne({ username: username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user);
            res.status(200).json({ token });
        } else {
            res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await userCol.findOne({ username: username });

        if (existingUser) {
            res.send('Username already taken');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { username, password: hashedPassword, email };
            await userCol.insertMany([newUser]);
            res.status(201).json('User created');
        }
    } catch (e) {
        res.send('Error adding user');
    }
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json('This is a protected route');
});

// Upload post
app.post('/upload-post', async (req, res) => {
    const { uid, img, text, location, visibility, uploadDate, takenDate } = req.body;

    try {
        await postsCol.create({
            uid,
            img,
            text,
            location,
            visibility,
            uploadDate,
            takenDate,
        });
        res.status(201).json('success');
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }
});

// Delete post
app.delete('/delete-post/', async (req, res) => {
    const { postId } = req.query; // Extract postId from URL parameters

    try {
        // Delete the post with the specified postId
        const result = await postsCol.deleteOne({ _id: postId });

        // Check if the post was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).send({ Status: 'error', data: 'Post not found' });
        }

        // Successfully deleted
        res.status(200).send({ Status: 'success', data: 'Post deleted successfully' });
    } catch (e) {
        // Handle any errors
        res.status(500).send({ Status: 'error', data: e.message });
    }
});

// Get posts by uid
app.get('/get-post', async (req, res) => {
    const { uid } = req.query;

    try {
        await postsCol.find({ uid: uid }).then(data => {
            res.status(201).send({ status: 'success', data: data });
        });
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }
});

// Get posts by uid, location, and visibility
app.get('/get-posts-by-loc', async (req, res) => {
    const { uid, lat, lon, visibility } = req.query;

    let findDict = { uid: uid, 'location.lat': lat, 'location.lon': lon };
    if (visibility) {
        findDict = { uid: uid, 'location.lat': lat, 'location.lon': lon, visibility: visibility };
    }

    try {
        await postsCol.find(findDict).then(data => {
            res.status(201).send({ status: 'success', data: data });
        });
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }
});

// Get posts by username, post visibility, and location
app.get('/get-posts-by-username-loc', async (req, res) => {
    const { username, visibility, lat, lon } = req.query;

    // Get uid
    let uid = null;
    try {
        await userCol.findOne({ username: username }).then(data => {
            uid = data.id;
        });
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }

    let findDict = { uid: uid, visibility: visibility };
    if (lat && lon) {
        findDict = { uid: uid, visibility: visibility, 'location.lat': lat, 'location.lon': lon };
    }

    try {
        await postsCol.find(findDict).then(data => {
            res.status(201).send({ Status: 'success', data: data });
        });
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }
});

// Get user by query
app.get('/search-users', async (req, res) => {
    const { search, limit = 5 } = req.query;

    try {
        const users = await userCol.find({}).exec();

        const results = users.map(user => ({
            ...user._doc, // spread to include all fields
            distance: levenshtein(search, user.username),
        }));

        results.sort((a, b) => a.distance - b.distance);
        const closestUsers = results.slice(0, parseInt(limit));

        res.status(201).send({ data: closestUsers });
    } catch (e) {
        res.send({ Status: 'error', data: e });
    }
});

app.post('/follow-user', async (req, res) => {
    const { followedId, followerId } = req.body;

    try {
        // Check if the user is already following the target user
        const existingRelation = await followCol.findOne({ followerId, followedId: followedId });

        if (existingRelation) {
            return res.send({ Status: 'error', data: 'Already following this user' });
        }

        // Create a new follow relationship
        const newRelation = new followCol({ followerId, followedId: followedId });
        await newRelation.save();

        res.status(201).send({ Status: 'success', data: 'Followed successfully!' });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Unfollow user
app.post('/unfollow-user', async (req, res) => {
    const { followedId, followerId } = req.body;

    try {
        // Check if the user is currently following the target user
        const existingRelation = await followCol.findOne({ followerId, followedId });

        if (!existingRelation) {
            return res.send({ Status: 'error', data: 'Not following this user' });
        }

        // Remove the follow relationship
        await followCol.deleteOne({ _id: existingRelation._id });

        res.status(201).send({ Status: 'success', data: 'User unfollowed successfully' });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Get followed people by user
app.get('/get-followed-uids', async (req, res) => {
    const { uid } = req.query;
    try {
        await followCol.find({ followerId: uid }).then(data => {
            res.status(201).send({ Status: 'success', data: data });
        });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Get posts by a list of uids and visibility
app.get('/get-posts-by-uids', async (req, res) => {
    const { uids, visibility } = req.query;

    try {
        // Find posts where the uid is in the list of uids
        const posts = await postsCol.find({ uid: { $in: uids }, visibility: visibility });
        res.status(201).send({ Status: 'success', data: posts });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Get posts and usernames by a list of uids, location, and visibility
app.get('/get-posts-by-uids-loc', async (req, res) => {
    const { uids, lat, lon, visibility } = req.query;

    try {
        const posts = await postsCol.find({
            uid: { $in: uids },
            'location.lat': lat,
            'location.lon': lon,
            visibility: visibility,
        });

        const postUids = posts.map(post => post.uid);

        const users = await userCol.find({
            _id: { $in: postUids },
        });

        // Transform users array into a map from id to username
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        res.status(201).send({ Status: 'success', posts: posts, users: userMap });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Like a post
app.post('/like-post', async (req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await postsCol.findById(postId);

        if (!post) {
            return res.status(404).send({ Status: 'error', data: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            // User already liked this post, so unlike it
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Add the user's ID to the likes array
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).send({ Status: 'success', data: post });
    } catch (e) {
        res.status(500).send({ Status: 'error', data: e.message });
    }
});

// Get all public posts with more than TOP_POST_LIKES_THRESHOLD likes
app.get('/top-posts', async (req, res) => {
    try {
        const posts = await postsCol.find({
            visibility: 'public',
            $expr: { $gte: [{ $size: '$likes' }, TOP_POST_LIKES_THRESHOLD] },
        });

        res.status(200).send({ Status: 'success', data: posts });
    } catch (e) {
        res.send({ Status: 'error', data: e.message });
    }
});

// Get top posts and usernames by location
app.get('/top-posts-by-loc', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const posts = await postsCol.find({
            visibility: 'public', // TODO: use enum
            'location.lat': lat,
            'location.lon': lon,
            $expr: { $gte: [{ $size: '$likes' }, TOP_POST_LIKES_THRESHOLD] },
        });

        const postUids = posts.map(post => post.uid);

        const users = await userCol.find({
            _id: { $in: postUids },
        });

        // Transform users array into a map from id to username
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        res.status(200).send({ Status: 'success', posts: posts, users: userMap });
    } catch (e) {
        res.status(500).send({ Status: 'error', data: e.message });
    }
});

// Get number of followers
app.get('/follower-count', async (req, res) => {
    const { uid } = req.query;

    try {
        const followers = await followCol.find({
            followedId: uid,
        });

        res.status(200).send({ Status: 'success', data: followers });
    } catch (e) {
        res.status(500).send({ Status: 'error', data: e.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
