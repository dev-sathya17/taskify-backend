// Importing the express library
const express = require("express");

// Importing the todos Controller
const todosController = require("../controllers/todos.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const todosRouter = express.Router();

// Defining routes
// Route to create Todos
todosRouter.post("/", auth.authenticate, todosController.createTodo);

// Route to get all user Todos
todosRouter.get("/", auth.authenticate, todosController.getUserTodos);

// Route to get a specific Todo by ID
todosRouter.get("/:id", auth.authenticate, todosController.getTodo);

// Route to update a specific Todo by ID
todosRouter.put("/:id", auth.authenticate, todosController.updateTodo);

// Route to delete a specific Todo by ID
todosRouter.delete("/:id", auth.authenticate, todosController.deleteTodo);

// Route to get todo's count chart
todosRouter.get(
  "/count/status",
  auth.authenticate,
  todosController.getTodosCountByStatus
);

// Route to get todo completion chart data
todosRouter.get(
  "/count/completion",
  auth.authenticate,
  todosController.getCompletedTodosCountByDate
);

// Route to get todo's count chart based on priority
todosRouter.get(
  "/count/priority",
  auth.authenticate,
  todosController.getTodosCountByPriority
);

// Route to get count of todo's due today
todosRouter.get(
  "/count/today",
  auth.authenticate,
  todosController.getDueTodayTodosCount
);

// Route to get user's completion percentage
todosRouter.get(
  "/count/completion/percentage",
  auth.authenticate,
  todosController.getUserCompletionPercentage
);

// Exporting the router
module.exports = todosRouter;
