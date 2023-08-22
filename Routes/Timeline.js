const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/auth');
const Tweet = require('../Models/Tweet.model');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const followedUserIds = req.user.followers;

    const timelineTweets = await Tweet.find({ author: { $in: followedUserIds } })
      .sort({ createdAt: -1 }) 
      .populate('author', 'username');

    res.json(timelineTweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timeline' });
  }
});

module.exports = router;
