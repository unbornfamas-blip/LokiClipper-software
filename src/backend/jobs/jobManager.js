const { randomUUID } = require("crypto");
const { JobStatus } = require("./jobStatus");
const { jobEvents } = require("./jobEvents");

class JobManager {
  constructor() {
    this.jobs = [];
  }

  emitUpdate(job) {
  jobEvents.emit("jobUpdated", {
    ...job
  });
}

  createJob(type) {
    const job = {
      id: randomUUID(),
      type,
      status: JobStatus.PENDING,
      progress: 0,
      message: "",
      startedAt: null,
      finishedAt: null,
      duration: null
    };

    this.jobs.push(job);
    this.emitUpdate(job);
    return job;
  }

  startJob(job, message = "") {
    job.status = JobStatus.RUNNING;
    job.progress = 0;
    job.startedAt = Date.now();
    job.finishedAt = null;
    job.duration = null;
    job.message = message;

    this.emitUpdate(job);
    return job;
  }

  completeJob(job, message = "") {
    job.status = JobStatus.COMPLETED;
    job.progress = 100;
    job.finishedAt = Date.now();
    job.message = message;

    if (job.startedAt !== null) {
      job.duration =
        (job.finishedAt - job.startedAt) / 1000;
    }

    this.emitUpdate(job);
    return job;
  }

  failJob(job, message = "") {
    job.status = JobStatus.FAILED;
    job.finishedAt = Date.now();
    job.message = message;

    if (job.startedAt !== null) {
      job.duration =
        (job.finishedAt - job.startedAt) / 1000;
    }
    this.emitUpdate(job);
    return job;
  }

  cancelJob(job, message = "") {
    job.status = JobStatus.CANCELLED;
    job.finishedAt = Date.now();
    job.message = message;
    this.emitUpdate(job);
    return job;
  }

  setProgress(job, progress, message = job.message) {
    const numericProgress = Number(progress);

    job.progress = Number.isFinite(numericProgress)
      ? Math.min(100, Math.max(0, numericProgress))
      : 0;

    job.message = message;
    this.emitUpdate(job);
    return job;
  }

  reset() {
    this.jobs = [];
  }

  getJobs() {
    return this.jobs.map(job => ({ ...job }));
  }
}

module.exports = {
  JobManager
};