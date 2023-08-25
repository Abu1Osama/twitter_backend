const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.model");
const router = express.Router();
const multer = require("multer"); // Import multer
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// User registration
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatars/"); // Set the destination directory for avatars
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB (adjust as needed)
  },
});

const uploadAvatar = multer({ storage: avatarStorage });
router.post("/register", uploadAvatar.single("avatar"), async (req, res) => {
  try {
    const { username, password, name, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = req.file ? req.file.filename : null;
    if (!avatar) {
      return res.status(400).json({ error: "Avatar upload failed" });
    }
    const user = new User({
      username,
      password: hashedPassword,
      name,
      dateOfBirth,
      avatar,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userResponse = {
      token,
      username: user.username,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      userId: user._id,
      followers: user.followers,
      avatar: user.avatar,
    };
    res.status(200).json(userResponse);

    await user.save();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});
router.post("/logout", async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = router;
