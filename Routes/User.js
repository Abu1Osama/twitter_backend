const express = require("express");
const User = require("../Models/User.model");
const authMiddleware = require("../Middleware/auth");
const router = express.Router();

router.post("/followUser/:userId", authMiddleware, async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.user.followers.includes(userIdToFollow)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    req.user.followers.push(userIdToFollow);
    await req.user.save();

    res.json({ message: "Successfully followed user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to follow user", error });
  }
});

router.post("/unfollowUser/:userId", authMiddleware, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.userId;

    req.user.followers = req.user.followers.filter(
      (id) => id.toString() !== userIdToUnfollow
    );
    await req.user.save();

    res.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

router.get("/getUser/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "User retrieval failed" });
  }
});
router.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});
router.patch("/editUser/:userId", authMiddleware, async (req, res) => {
  try {
    const userIdToUpdate = req.params.userId;

    if (req.user._id.toString() !== userIdToUpdate) {
      return res.status(403).json({ error: "You are not authorized to edit this user" });
    }

    const updates = req.body; 

    const user = await User.findByIdAndUpdate(userIdToUpdate, updates, {
      new: true, 
      runValidators: true, 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
