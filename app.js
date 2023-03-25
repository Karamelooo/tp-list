const express = require("express");
require("dotenv").config();
require("./db");
const authRouter = require("./router/auth.router");
const listRouter = require("./router/list.router");
const todoRouter = require("./router/todo.router");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.param("listId", (req, res, next, listId) => {
  req.listId = listId;
  next();
});

app.use("/auth", authRouter);
app.use("/list", listRouter);
app.use("/list/:listId/todo", todoRouter);

app.use((req, res, err) => {
  res.status(500).json({ status: "error", message: err });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found, url must be wrong" });
});

app.listen(PORT, () => {
  console.log(`server launched on port ${PORT}`);
});
