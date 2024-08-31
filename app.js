// Importing the express library
const express = require("express");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Creating an express application
const app = express();

const userRouter = require("./routes/user.route");

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/api/v1/users", userRouter);

// Export the express app
module.exports = app;
