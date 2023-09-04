const express = require("express");
const multer = require("multer");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const connectDB = require("./Control/db");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./Routes/Auth");
const tweetRoutes = require("./Routes/Tweet");
const userRoutes = require("./Routes/User");
const messageRoutes = require("./Routes/Message");
const timelineRoutes = require("./Routes/Timeline");
const path = require("path");
dotenv.config();
connectDB();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://twitterclone-abu1osama.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const tweetimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination directory for avatars
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

const upload = multer({ storage: tweetimage });

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
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Example: Real-time chat messaging
  socket.on("chatMessage", (message) => {
    // Broadcast the message to all connected clients (including the sender)
    io.emit("chatMessage", message);
  });
});


// Use the upload middleware for handling image uploads
app.use("/avatars", express.static(path.join(__dirname, "avatars/")));
app.use("/uploads", express.static(path.join(__dirname, "uploads/")));
app.use("/auth", authRoutes);
app.use("/tweets", tweetRoutes);
app.use("/users", userRoutes);
app.use("/timeline", timelineRoutes);
app.use("/messages", messageRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
