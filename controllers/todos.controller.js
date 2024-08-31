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
      const { title, description, deadline, status, priority, completedOn } =
        req.body;

      const todo = await Todo.findById(id);

      todo.title = title || todo.title;
      todo.description = description || todo.description;
      todo.deadline = deadline || todo.deadline;
      todo.status = status || todo.status;
      todo.priority = priority || todo.priority;

      if (status === "completed") {
        todo.completedOn = new Date();
      }

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

  // Mark: Today's
  // API to get todos count by status
  getTodosCountByStatus: async (req, res) => {
    try {
      const statuses = ["pending", "in-progress", "completed", "backlog"];

      // Fetch the user and populate todos
      const user = await User.findById(req.userId).populate("todos");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Initialize the result object with status counts
      const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {});

      // Count todos by status
      user.todos.forEach((todo) => {
        if (statusCounts.hasOwnProperty(todo.status)) {
          statusCounts[todo.status]++;
        }
      });

      // Return the count of todos by status
      res.json(statusCounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get todos completion graph
  getCompletedTodosCountByDate: async (req, res) => {
    try {
      // Find todos where completedOn is not null
      const completedTodos = await Todo.find({
        completedOn: { $exists: true, $ne: null },
        userId: req.userId,
      });

      // Create a map to store counts by formatted date
      const countsByDate = {};

      completedTodos.forEach((todo) => {
        // Format the completedOn date as "YYYY/MM/DD"
        const formattedDate = new Date(todo.completedOn)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/");

        // If the date is already in the map, increment the count, otherwise set it to 1
        if (countsByDate[formattedDate]) {
          countsByDate[formattedDate]++;
        } else {
          countsByDate[formattedDate] = 1;
        }
      });

      res.json(countsByDate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get todos count by priority
  getTodosCountByPriority: async (req, res) => {
    try {
      const countsByPriority = await Todo.aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {
        low: 0,
        medium: 0,
        high: 0,
      };

      countsByPriority.forEach((item) => {
        if (item._id) {
          result[item._id] = item.count;
        }
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get todos count that are due today
  getDueTodayTodosCount: async (req, res) => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for the beginning of the day
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Set time to midnight for the beginning of the next day

      // Count todos that are due today
      const count = await Todo.countDocuments({
        deadline: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      res.json({ dueToday: count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to measure user's completion percentage
  getUserCompletionPercentage: async (req, res) => {
    try {
      // Fetch the user and populate todos
      const user = await User.findById(req.userId).populate("todos");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Count completed todos and total todos
      const completedTodos = user.todos.filter(
        (todo) => todo.status === "completed"
      ).length;
      const totalTodos = user.todos.length;

      // Calculate completion percentage
      const completionPercentage =
        ((completedTodos / totalTodos) * 100).toFixed(2) || 0;
      res.json({ completionPercentage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = todosController;
