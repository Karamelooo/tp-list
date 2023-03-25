const List = require("../models/list.model");

const isListIdInDB = async (req, res, next) => {
  try {
    if (!req.listId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(401).json({ message: "Please enter correct Id" });
    }
    const foundListById = await List.findById(req.listId);
    if (!foundListById) {
      return res.status(404).json({ message: "list not found" });
    }
    req.listUserId = { userId: foundListById.userId };
    req.listName = { name: foundListById.name };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isListIdInDB;
