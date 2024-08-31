// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/user.controller");

// Creating a router
const userRouter = express.Router();

// Route to register a user
userRouter.post("/register", userController.register);

// Exporting the router
module.exports = userRouter;
