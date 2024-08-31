// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

// Creating a router
const userRouter = express.Router();

// Route to register a user
userRouter.post("/register", userController.register);

// Route to login a user
userRouter.post("/login", userController.login);

// Route to logout a user
userRouter.get("/logout", auth.authenticate, userController.logout);

// Exporting the router
module.exports = userRouter;
