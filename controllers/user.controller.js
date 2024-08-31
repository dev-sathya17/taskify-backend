// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the User model
const User = require("../models/user");

// Importing helper function to send email
const sendEmail = require("../helpers/emailHelper");

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
};

module.exports = userController;
