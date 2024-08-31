// Importing the mongoose library
const mongoose = require("mongoose");

// Defining a schema for the users collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  otp: {
    type: String,
    default: null,
  },
});

// Exporting the User model for use in other parts of the application
module.exports = mongoose.model("User", userSchema, "users");
