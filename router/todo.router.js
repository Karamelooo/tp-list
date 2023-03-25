const router = require("express").Router();
const authentication = require("../middlewares/authentication.mid");
const isListIdInDB = require("../middlewares/isListIdInDB.mid");
const Todo = require("../models/todo.model");

const requiredTodoKeys = ["name"];

// get every todos from an user list
router.get("/", authentication, isListIdInDB, async (req, res, next) => {
  try {
    const foundTodo = await Todo.find({ listId: req.listId });
    if (foundTodo.length === 0) {
      return res.status(404).json({ message: "No todo found" });
    }
    res.status(200).json(foundTodo);
  } catch (error) {
    next(error);
  }
});

// get a specific todo by id from user list
router.get("/:todoId", authentication, isListIdInDB, async (req, res, next) => {
  try {
    if (!req.params.todoId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(401).json({ message: "Please enter correct Id" });
    }
    const { todoId } = req.params;
    const foundTodo = await Todo.findById(todoId);
    if (!foundTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    const { userId } = req.user;
    if (userId !== req.listUserId.userId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this todo" });
    }
    res.status(200).json(foundTodo);
  } catch (error) {
    next(error);
  }
});

// post a todo
router.post("/", authentication, isListIdInDB, async (req, res, next) => {
  try {
    const list = req.body;
    const isEveryKeyInRequest = requiredTodoKeys.every((key) =>
      Object.keys(list).includes(key)
    );
    if (!isEveryKeyInRequest) {
      return res.status(422).json({
        message: "You must name your todo",
      });
    }
    const isTodoAlreadyExist = await Todo.findOne({
      name: list.name,
      listId: req.listId,
    });
    console.log(isTodoAlreadyExist);
    if (isTodoAlreadyExist) {
      return res
        .status(401)
        .json({ message: "You already named a todo like that" });
    }
    const ans = await Todo.create({
      name: list.name,
      description: req.body.description,
      listId: req.listId,
    });
    res.status(201).json(ans);
  } catch (error) {
    next(error);
  }
});

// patch a todo from user list
router.patch(
  "/:todoId",
  authentication,
  isListIdInDB,
  async (req, res, next) => {
    try {
      if (!req.params.todoId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(401).json({ message: "Please enter correct Id" });
      }
      const { userId } = req.user;
      const listUserId = req.listUserId.userId.toString();
      if (userId !== listUserId) {
        return res
          .status(401)
          .json({ message: "Unauthorized to edit this todo" });
      }
      const ans = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Todo updated!", updateList: ans });
    } catch (error) {
      next(error);
    }
  }
);

// delete a specific todo from user list
router.delete(
  "/:todoId",
  authentication,
  isListIdInDB,
  async (req, res, next) => {
    try {
      if (!req.params.todoId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(401).json({ message: "Please enter correct Id" });
      }
      const { todoId } = req.params;
      const foundTodo = await Todo.findById(todoId);
      if (!foundTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      const { userId } = req.user;
      const listUserId = req.listUserId.userId.toString();
      if (userId !== listUserId) {
        return res
          .status(401)
          .json({ message: "Unauthorized to delete this todo" });
      }
      await Todo.findByIdAndDelete(req.params.todoId);
      return res.status(202).json({ message: "todo deleted" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
