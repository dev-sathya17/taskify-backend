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

// Exporting the router
module.exports = todosRouter;
