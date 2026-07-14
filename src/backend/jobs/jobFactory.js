const { jobManager } = require("./jobService");

function createPendingJob(type, message = "") {
  const job = jobManager.createJob(type);
  job.message = message;
  jobManager.emitUpdate(job);

  return job;
}

function createRunningJob(type, message = "") {
  const job = jobManager.createJob(type);

  jobManager.startJob(job, message);

  return job;
}

function completeJob(job, message = "") {
  return jobManager.completeJob(job, message);
}

function failJob(job, message = "") {
  return jobManager.failJob(job, message);
}

function setProgress(job, progress, message = "") {
  return jobManager.setProgress(
    job,
    progress,
    message
  );
}

module.exports = {
  createPendingJob,
  createRunningJob,
  completeJob,
  failJob,
  setProgress
};