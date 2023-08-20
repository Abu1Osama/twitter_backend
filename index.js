const express = require("express");
const app = express();
const connectDB = require("./Control/db");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require('./Routes/Auth');
const tweetRoutes = require('./Routes/Tweet');
const userRoutes = require('./Routes/User');
const timelineRoutes = require('./Routes/Timeline');
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);
app.use('/timeline', timelineRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
