const express = require("express");
const Tweet = require("../Models/Tweet.model");
const authMiddleware = require("../Middleware/auth");
const router = express.Router();
const multer = require("multer");

const tweetimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination directory for avatars
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"));
    }
  },
});

const upload = multer({ storage: tweetimage });

router.post(
  "/createTweet",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { content } = req.body;
      const image = req.file ? req.file.filename : null;
      const newTweet = new Tweet({ author: req.user._id, content, image });
      await newTweet.save();
      res.status(201).json(newTweet);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Tweet creation failed" });
    }
  }
);
router.get("/allTweetsWithProfiles", authMiddleware, async (req, res) => {
  try {
    const allTweets = await Tweet.find().populate("author", "username name");
    res.json(allTweets);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve all tweets with user profiles" });
  }
});

router.get("/userTweets", authMiddleware, async (req, res) => {
  try {
    const userTweets = await Tweet.find({ author: req.user._id });
    res.json(userTweets);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user tweets" });
  }
});
// Get a specific tweet
router.get("/:tweetId", authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: "Tweet retrieval failed" });
  }
});

// Edit a tweet
router.put("/:tweetId/edit", authMiddleware, async (req, res) => {
  try {
    const updatedContent = req.body.content; // Assuming you pass the updated content in the request body
    const tweet = await Tweet.findByIdAndUpdate(
      req.params.tweetId,
      { content: updatedContent },
      { new: true } // Return the updated tweet
    );
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ error: "Tweet edit failed" });
  }
});

// Delete a tweet
router.delete("/:tweetId/delete", authMiddleware, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    res.json({ message: "Tweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Tweet deletion failed" });
  }
});

module.exports = router;
