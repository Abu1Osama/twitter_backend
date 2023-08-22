const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  image: { type: String },  
  createdAt: { type: Date, default: Date.now },
  // You can add other tweet-related fields here
});

module.exports = mongoose.model("Tweet", tweetSchema);
