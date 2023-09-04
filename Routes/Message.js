const express = require("express");
const router = express.Router();
const Message = require("../Models/Message.model");
const authMiddleware = require("../Middleware/auth");

// Route to send a message
router.post("/send",authMiddleware, async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    const newMessage = new Message({ sender, recipient, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({msg: error.message });
  }
});

// Route to retrieve messages for a user
router.get("/user/:userId",authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort("-timestamp"); // Sort by timestamp in descending order
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send({msg: error.message });
  }
});

module.exports = router;
