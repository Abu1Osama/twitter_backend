const express = require("express");
const multer = require("multer");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./Models/Message.model");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Attach socket.io to the HTTP server
const connectDB = require("./Control/db");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors middleware
const authRoutes = require("./Routes/Auth");
const tweetRoutes = require("./Routes/Tweet");
const userRoutes = require("./Routes/User");
const messageRoutes = require("./Routes/Message");
const timelineRoutes = require("./Routes/Timeline");
const path = require("path");
dotenv.config();
connectDB();

app.use(express.json());

// Configure CORS for your Express app
const allowedOrigins = [
  "http://localhost:3000",
  "https://twitterclone-abu1osama.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rest of your middleware and routes...

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Handle chat messages
  socket.on("chatMessage", async (message) => {
    try {
      // Save the message to the database
      const savedMessage = await Message.create(message);

      // Broadcast the message to all connected clients (including the sender)
      io.emit("chatMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
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
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
