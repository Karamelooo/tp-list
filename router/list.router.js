const router = require("express").Router();
const authentication = require("../middlewares/authentication.mid");
const isListIdInDB = require("../middlewares/isListIdInDB.mid");
const List = require("../models/list.model");

const requiredListKeys = ["name"];

// get every lists from user
router.get("/", authentication, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const foundList = await List.find({ userId });
    if (foundList.length === 0) {
      return res.status(404).json({ message: "No list found" });
    }
    res.status(200).json(foundList);
  } catch (error) {
    next(error);
  }
});

// get a specific list by id from user
router.get("/:listId", authentication, isListIdInDB, async (req, res, next) => {
  try {
    const { listId } = req.params;
    const foundList = await List.findById(listId);
    if (!foundList) {
      return res.status(404).json({ message: "list not found" });
    }
    const { userId } = req.user;
    const listUserId = foundList.userId.toString();
    if (userId !== listUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this list" });
    }
    res.status(200).json(foundList);
  } catch (error) {
    next(error);
  }
});

// post a list
router.post("/", authentication, async (req, res, next) => {
  try {
    const list = req.body;
    const isEveryKeyInRequest = requiredListKeys.every((key) =>
      Object.keys(list).includes(key)
    );
    if (!isEveryKeyInRequest) {
      return res.status(422).json({
        message: "You must name your list",
      });
    }
    const { userId } = req.user;
    const isListAlreadyExist = await List.findOne({ name: list.name, userId });
    console.log(isListAlreadyExist);
    if (isListAlreadyExist) {
      return res
        .status(401)
        .json({ message: "You already named a list like that" });
    }
    const ans = await List.create({ name: list.name, userId });
    res.status(201).json(ans);
  } catch (error) {
    next(error);
  }
});

// replace a list
router.put("/:listId", authentication, isListIdInDB, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const listUserId = req.listUserId.userId.toString();
    if (userId !== listUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized to edit this list" });
    }
    if (!req.body.name) {
      res.status(401).json({ message: "Please enter a new name" });
    }
    if (req.body.name === req.listName.name) {
      res.status(401).json({ message: "Please enter a different name" });
    }
    const ans = await List.findByIdAndUpdate(req.params.listId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "list updated!", updateList: ans });
  } catch (error) {
    next(error);
  }
});

// delete a specific list
router.delete(
  "/:listId",
  authentication,
  isListIdInDB,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const listUserId = req.listUserId.userId.toString();
      if (userId !== listUserId) {
        return res
          .status(401)
          .json({ message: "Unauthorized to delete this list" });
      }
      await List.findByIdAndDelete(req.params.listId);
      return res.status(202).json({ message: "list deleted" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
