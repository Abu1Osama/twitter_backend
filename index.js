const express = require("express");
const multer = require("multer");
const app = express();
const connectDB = require("./Control/db");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require('./Routes/Auth');
const tweetRoutes = require('./Routes/Tweet');
const userRoutes = require('./Routes/User');
const timelineRoutes = require('./Routes/Timeline');
const path = require("path");
dotenv.config();
connectDB();

app.use(express.json());
const allowedOrigins = [ 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));



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

// Use the upload middleware for handling image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);
app.use('/timeline', timelineRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
