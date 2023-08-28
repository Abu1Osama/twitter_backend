const express = require("express");
const multer = require("multer");
const crypto = require('crypto'); 
const app = express();
const connectDB = require("./Control/db");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./Routes/Auth");
const tweetRoutes = require("./Routes/Tweet");
const userRoutes = require("./Routes/User");
const timelineRoutes = require("./Routes/Timeline");
const path = require("path");

dotenv.config();
connectDB();

app.use(express.json());
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + '.' + file.originalname.split('.').pop());
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"));
    }
  },
});

const upload = multer({ storage: storage });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatars/"); // Set the destination directory for avatars
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"));
    }
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

// Use the upload middleware for handling image uploads
app.use("/avatars", express.static(path.join(__dirname, "avatars/")));



app.use("/uploads", express.static(path.join(__dirname, "uploads/")));



app.use("/auth", authRoutes);
app.use("/tweets", tweetRoutes);
app.use("/users", userRoutes);
app.use("/timeline", timelineRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
