const Todo = require("../models/todo");
const sendEmail = require("./emailHelper");

const isDeadlineTomorrow = (deadline) => {
  const today = new Date();
  const startOfTomorrow = new Date(today);
  startOfTomorrow.setDate(today.getDate() + 1);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date(today);
  endOfTomorrow.setDate(today.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const deadlineDate = new Date(deadline);

  return deadlineDate >= startOfTomorrow && deadlineDate <= endOfTomorrow;
};

const notifyDeadlines = async () => {
  const todos = await Todo.find({
    status: { $in: ["pending", "in-progress"] },
  }).populate("userId");

  todos.forEach((todo) => {
    const deadline = todo.deadline;

    if (isDeadlineTomorrow(deadline) && !todo.isNotified) {
      console.log(`Todo ${todo.title} is due tomorrow.`);
      todo.isNotified = true;
      todo.save();
      const subject = `Deadline Notification for Todo, ${todo.title}.`;
      const text = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Todo Deadline Reminder</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            width: 80%;
                            margin: 20px auto;
                            background: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #007bff;
                            color: #ffffff;
                            padding: 10px;
                            border-radius: 8px 8px 0 0;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                        }
                        .todo-details {
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            padding: 10px;
                            margin-bottom: 20px;
                        }
                        .todo-details p {
                            margin: 0;
                            padding: 0;
                        }
                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Reminder: Task Deadline Tomorrow</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${todo.userId.name},</p>
                            <p>This is a friendly reminder that you have a task deadline tomorrow. Please review the details below:</p>
                            
                            <div class="todo-details">
                                <h2>Task Details</h2>
                                <p><strong>Title:</strong> ${todo.title}</p>
                                <p><strong>Description:</strong> ${
                                  todo.description
                                }</p>
                                <p><strong>Due Date:</strong> ${todo.deadline.toISOString()}</p>
                                <p><strong>Status:</strong> ${todo.status}</p>
                                <p><strong>Priority:</strong> ${
                                  todo.priority
                                }</p>
                            </div>

                            <p>Make sure to complete the task by the end of the day tomorrow. If you have any questions or need assistance, please let us know.</p>
                            <p>Best regards,<br>Taskify Team</p>
                        </div>
                    </div>
                </body>
                </html>`;
      sendEmail(todo.userId.email, subject, text);
    }
  });
};

module.exports = { notifyDeadlines };
