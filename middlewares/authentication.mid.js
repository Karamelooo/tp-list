const jwt = require("jsonwebtoken");
require("../models/user.model");
require("dotenv").config();

const authentication = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { userId, email } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = {
      userId,
      email,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
