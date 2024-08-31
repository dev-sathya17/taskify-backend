// Importing the User model
const User = require("../models/user");

// Importing the Todo model
const Todo = require("../models/todo");

const todosController = {
  // API to create Todos
  createTodo: async (req, res) => {
    try {
      const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        deadline: new Date(req.body.deadline),
        priority: req.body.priority,
        userId: req.userId,
      });

      const user = await User.findById(req.userId);

      const savedTodo = await todo.save();

      user.todos.push(savedTodo._id);

      await user.save();

      res.status(201).json({ savedTodo, message: "Todo saved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all Todos for a specific user
  getUserTodos: async (req, res) => {
    try {
      const todos = await Todo.find({ userId: req.userId });
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to update a specific Todo
  updateTodo: async (req, res) => {
    try {
      const id = req.params.id;
      const { title, description, deadline, status, priority } = req.body;

      const todo = await Todo.findById(id);

      todo.title = title || todo.title;
      todo.description = description || todo.description;
      todo.deadline = deadline || todo.deadline;
      todo.status = status || todo.status;
      todo.priority = priority || todo.priority;

      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a specific Todo
  deleteTodo: async (req, res) => {
    try {
      // Delete the todo item by its ID
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      // Remove the deleted todo from the user's todos array
      await User.findByIdAndUpdate(
        req.userId,
        { $pull: { todos: req.params.id } },
        { new: true } // Return the updated document
      );

      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get a specific Todo
  getTodo: async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);

      if (!todo) return res.status(404).json({ message: "Todo not found" });

      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = todosController;
