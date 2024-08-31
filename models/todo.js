const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "backlog"],
    default: "pending",
  },
  deadline: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedOn: {
    type: Date,
    default: null,
  },
});

const Todo = mongoose.model("Todo", todoSchema, "todos");

module.exports = Todo;
