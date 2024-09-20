# Taskify Backend

Welcome to the Taskify backend. This server-side application is built using Node.js, Express, and MongoDB to handle task management functionalities. It supports user authentication, task management operations, and cron jobs for automated tasks. The backend integrates with the frontend for seamless task management, featuring secure routes and well-organized code.

## Features

- **Authentication & Authorization**: JWT-based authentication to secure routes and manage user sessions.
- **Task Management**: CRUD operations for tasks (create, read, update, delete) with proper validations.
- **User Roles**: Support for different user roles (Admin, Employee) with role-based access controls.
- **Cron Jobs**: Scheduled tasks using `node-cron` for automation.
- **Email Notifications**: Sends automated email notifications to users using `nodemailer`.
- **File Upload**: Supports file uploads using `multer`.

## Dependencies

The project uses the following dependencies:

- `bcrypt`: For password hashing and security.
- `cookie-parser`: To parse cookies attached to client requests.
- `cors`: To handle Cross-Origin Resource Sharing.
- `dotenv`: For loading environment variables from a `.env` file.
- `express`: Web framework for handling server requests.
- `jsonwebtoken`: For signing and verifying JSON Web Tokens (JWT) to manage authentication.
- `mongoose`: For managing MongoDB interactions and data models.
- `morgan`: HTTP request logger for debugging purposes.
- `multer`: Middleware for handling file uploads.
- `node-cron`: For scheduling cron jobs to run at specific times.
- `nodemailer`: For sending emails, such as task reminders or notifications.

## Folder Structure

```
src/
│
├── controllers/    # Controllers for handling requests
├── helpers/        # Helper functions and utilities
├── middlewares/    # Middleware functions for authentication and authorization
├── models/         # Mongoose models for database entities
├── routes/         # Route definitions
├── utils/          # Utility functions and configurations
├── jobs/           # Cron Jobs
├── app.js          # Main application file
└── ...
```

---

## Entities

- **User**: Manages user data and authentication.
- **Todo**: Handles todo-related operations.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB

### Installation

1. Pull the repository to your local machine.

```
git pull
```

2. To install all the dependencies:

```
npm install
```

3. Once everything is installed successfully, now it's time to run the server.

```
npm run dev
```

---

### Configuration

```
MONGODB_URI=mongo_db_uri
SERVER_PORT=3000
SECRET_KEY=your_jwt_secret
EMAIL_ID=your_email_id
APP_PASSWORD=your_email_app_password
```

### To have a walkthrough into Quick Fix

#### Here are admin credentials

> - vsvs2209@gmail.com
> - password: Admin@123
