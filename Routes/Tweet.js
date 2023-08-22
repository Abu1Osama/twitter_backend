const express = require('express');
const Tweet = require('../Models/Tweet.model');
const authMiddleware = require('../Middleware/auth');
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage });
// Create a new tweet
// router.post('/createTweet', authMiddleware, async (req, res) => {
//   try {
//     const { content } = req.body;
//     const newTweet = new Tweet({ author: req.user._id, content });
//     await newTweet.save();
//     res.status(201).json(newTweet);
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Tweet creation failed' });
//   }
// });
router.post('/createTweet', authMiddleware,upload.array('images', 4), async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files.map(file => file.filename);
    const newTweet = new Tweet({ author: req.user._id, content, images });
    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Tweet creation failed' });
  }
});
router.get('/allTweetsWithProfiles', authMiddleware, async (req, res) => {
  try {
    const allTweets = await Tweet.find().populate('author', 'username name'); 
    res.json(allTweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all tweets with user profiles' });
  }
});

router.get('/userTweets', authMiddleware, async (req, res) => {
  try {
    const userTweets = await Tweet.find({ author: req.user._id });
    res.json(userTweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user tweets' });
  }
});
// Get a specific tweet
router.get('/:tweetId', authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: 'Tweet retrieval failed' });
  }
});

// Edit a tweet
router.put('/:tweetId/edit', authMiddleware, async (req, res) => {
  try {
    const updatedContent = req.body.content; // Assuming you pass the updated content in the request body
    const tweet = await Tweet.findByIdAndUpdate(
      req.params.tweetId,
      { content: updatedContent },
      { new: true } // Return the updated tweet
    );
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: 'Tweet edit failed' });
  }
});

// Delete a tweet
router.delete('/:tweetId/delete', authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Tweet deletion failed' });
  }
});

module.exports = router;
