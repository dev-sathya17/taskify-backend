// Importing the express library
const express = require("express");

// Importing the admin Controller
const adminController = require("../controllers/admin.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const adminRouter = express.Router();

// Defining routes
// API to fetch all users
adminRouter.get(
  "/users",
  auth.authenticate,
  auth.authorize,
  adminController.getAllUsers
);

// Route to get todo's count chart
adminRouter.get(
  "/count/status",
  auth.authenticate,
  auth.authorize,
  adminController.getTodosCountByStatus
);

// Route to get todo completion chart data
adminRouter.get(
  "/count/completion",
  auth.authenticate,
  auth.authorize,
  adminController.getCompletedTodosCountByDate
);

// Route to get todo's count chart based on priority
adminRouter.get(
  "/count/priority",
  auth.authenticate,
  auth.authorize,
  adminController.getTodosCountByPriority
);

// Route to get count of todo's due today
adminRouter.get(
  "/count/today",
  auth.authenticate,
  auth.authorize,
  adminController.getDueTodayTodosCount
);

// Route to get user's completion percentage
adminRouter.get(
  "/count/completion/percentage",
  auth.authenticate,
  auth.authorize,
  adminController.getTotalCompletionPercentage
);

// Route to get total users

adminRouter.get(
  "/count/users",
  auth.authenticate,
  auth.authorize,
  adminController.getTotalUsersCount
);

// Exporting the router
module.exports = adminRouter;
