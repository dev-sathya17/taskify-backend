// Importing the express library
const express = require("express");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Creating an express application
const app = express();

// Importing the routes for users and todos
const userRouter = require("./routes/user.route");
const todosRouter = require("./routes/todos.route");
const adminRouter = require("./routes/admin.route");

// parse the cookies of the request
app.use(cookieParser());

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Adding the notification job
require("./jobs/NotificationJob");

// Creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todosRouter);
app.use("/api/v1/admin", adminRouter);

// Export the express app
module.exports = app;
