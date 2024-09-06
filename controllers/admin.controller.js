// Importing the user model
const User = require("../models/user");

// Importing the todos model
const Todo = require("../models/todo");

const adminController = {
  // API to fetch all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "user" });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get todos count by status
  getTodosCountByStatus: async (req, res) => {
    try {
      const statuses = ["pending", "in-progress", "completed", "backlog"];

      // Fetch the user and populate todos
      const users = await User.find({ role: "user" }).populate("todos");

      // Initialize the result object with status counts
      const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {});

      // Count todos by status
      users.forEach((user) => {
        user.todos.forEach((todo) => {
          if (statusCounts.hasOwnProperty(todo.status)) {
            statusCounts[todo.status]++;
          }
        });
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
  getTotalCompletionPercentage: async (req, res) => {
    try {
      // Fetch the user and populate todos
      const users = await User.find({ role: "user" }).populate("todos");

      let totalTodos = 0,
        completedTodosCount = 0;
      users.forEach((user) => {
        const completedTodos = user.todos.filter(
          (todo) => todo.status === "completed"
        );
        completedTodosCount += completedTodos.length;
        totalTodos += user.todos.length;
      });

      // Calculate completion percentage
      const completionPercentage =
        ((completedTodosCount / totalTodos) * 100).toFixed(2) || 0;
      res.json({ completionPercentage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to count the number of users
  getTotalUsersCount: async (req, res) => {
    try {
      const count = await User.countDocuments({ role: "user" });
      res.json({ totalUsers: count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all todos
  getAllTodos: async (req, res) => {
    try {
      const todos = await Todo.find().populate("userId");
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
