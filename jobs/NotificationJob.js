const cron = require("node-cron");
const { notifyDeadlines } = require("../helpers/notificationHelper");
const { markAsBacklog } = require("../helpers/todoHelper");

// Schedule the job to run every hour
cron.schedule("10 * * * * *", () => {
  console.log("Checking deadlines...");
  // notifyDeadlines();
  markAsBacklog();
});
