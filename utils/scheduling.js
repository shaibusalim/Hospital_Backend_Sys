const schedule = require('node-schedule');

function scheduleReminder(patientId, noteId, reminderTime) {
  schedule.scheduleJob(reminderTime, function() {
    console.log(`Reminder for Patient ID: ${patientId} regarding Note ID: ${noteId}`);
    // Logic to send reminder notification would go here
  });
}

function cancelReminder(jobId) {
  const job = schedule.scheduledJobs[jobId];
  if (job) {
    job.cancel();
    console.log(`Cancelled reminder for Job ID: ${jobId}`);
  }
}

module.exports = { scheduleReminder, cancelReminder };
