const jwt = require("jsonwebtoken");
const User = require("../Models/User.model");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Authentication required" });
  }
};

module.exports = authMiddleware;
