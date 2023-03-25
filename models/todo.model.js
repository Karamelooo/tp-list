const mongoose = require("mongoose");

const { Schema } = mongoose;

const todoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  description: {
    type: String,
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
