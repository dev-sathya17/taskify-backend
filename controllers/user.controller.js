// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the User model
const User = require("../models/user");

// Importing helper function to send email
const sendEmail = require("../helpers/emailHelper");

// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the EMAIL_ID from the configuration file
const { SECRET_KEY } = require("../utils/config");

const userController = {
  // API for registering users
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const { name, email, password, mobile, role } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Checking if mobile number already exists
      const existingMobile = await User.findOne({ mobile });

      if (existingMobile) {
        return res.json({ message: "Mobile number must be unique" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        mobile,
        image: req.file ? req.file.path : "uploads/avatar.png",
        role: role || "user",
      });

      // Saving the user to the database
      await user.save();

      const subject = "Welcome to Taskify!";
      const text = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Taskify</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin: auto;
                        }
                        h1 {
                            color: #333333;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555555;
                        }
                        .button {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background-color: #28a745;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to Taskify!</h1>
                        <p>Hi there,</p>
                        <p>We're thrilled to have you on board. Taskify is here to help you organize, prioritize, and conquer your to-do list with ease.</p>
                        <p>Get started by logging in and adding your first task. We can't wait to see what you'll accomplish!</p>
                        <p>Cheers,<br>The Taskify Team</p>
                    </div>
                </body>
                </html>
                `;

      // Sending an email notification
      sendEmail(email, subject, text);

      // Sending a success response
      res.status(201).json({
        message:
          "Your account has been created successfully. Check your email to activate your account.",
        user,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API for user login
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { email, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({ email });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // Setting user role as cookie
      res.cookie("role", user.role, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // sending a success response
      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for user logout
  logout: async (req, res) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).send({ message: "User not authenticated" });
      }

      // clearing the cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("role", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = userController;
