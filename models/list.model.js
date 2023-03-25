const mongoose = require("mongoose");

const { Schema } = mongoose;

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // todos: [{
  //     type: Schema.Types.ObjectId,
  //     ref:'Todo'
  // }]
});

const List = mongoose.model("List", listSchema);

module.exports = List;
