const Todo = require("../models/todo");
const sendEmail = require("./emailHelper");

const markAsBacklog = async () => {
  const todos = await Todo.find({
    status: {
      $in: ["in-progress", "pending"],
    },
  }).populate("userId");
  const now = new Date();
  todos.forEach((todo) => {
    if (todo.deadline < now) {
      todo.status = "backlog";
      todo.save();
      console.log(`Marked ${todo.title} as backlog`);
      const subject = `Urgent: Your Todo Deadline Has Been Missed and Marked as Backlog.`;
      const text = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Todo Deadline Missed</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #ff6f61;
                            font-size: 24px;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .todo-details {
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-left: 4px solid #ff6f61;
                            margin-bottom: 20px;
                        }
                        .todo-details h2 {
                            font-size: 20px;
                            margin: 0 0 10px;
                            color: #ff6f61;
                        }
                        .todo-details p {
                            margin: 5px 0;
                            font-weight: bold;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 14px;
                            color: #aaa;
                        }
                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Todo Deadline Missed</h1>
                        <p>Dear ${todo.userId.name},</p>
                        <p>We noticed that you missed the deadline for the following task. As a result, it has been marked as a backlog. Please review the task details below and take necessary action:</p>
                        <div class="todo-details">
                            <h2>Title: ${todo.title}</h2>
                            <p>Description: ${todo.description}</p>
                            <p>Priority: ${todo.priority}</p>
                            <p>Status: <strong style="color: #ff6f61;">Backlog</strong></p>
                        </div>
                        <div class="footer">
                            <p>Thank you,</p>
                            <p>Taskify Team</p>
                        </div>
                    </div>
                </body>
                </html>`;
      sendEmail(todo.userId.email, subject, text);
    }
  });
};

module.exports = { markAsBacklog };
