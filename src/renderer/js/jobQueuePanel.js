const STATUS_LABELS = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled"
};

const STATUS_ICONS = {
  pending: "○",
  running: "⏳",
  completed: "✓",
  failed: "✕",
  cancelled: "–"
};

function formatJobType(type) {
  return String(type)
    .replaceAll("-", " ")
    .replace(/\b\w/g, character =>
      character.toUpperCase()
    );
}

function clampProgress(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
}

const jobs = new Map();

export function initialiseJobQueuePanel() {
  const queueList =
    document.getElementById("jobQueueList");

  const queueSummary =
    document.getElementById("jobQueueSummary");

  const queueProgress =
    document.getElementById("jobQueueProgress");

  function renderJobs(jobs = []) {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      queueSummary.textContent = "No processing jobs";
      queueProgress.textContent = "0%";

      queueList.innerHTML = `
        <div class="job-queue-empty">
          Import a video to begin processing.
        </div>
      `;

      return;
    }

    const completedJobs = jobs.filter(
      job => job.status === "completed"
    ).length;

    const totalProgress = jobs.reduce(
      (sum, job) =>
        sum + clampProgress(job.progress),
      0
    );

    const overallProgress =
      totalProgress / jobs.length;

    queueSummary.textContent =
      `${completedJobs} of ${jobs.length} jobs complete`;

    queueProgress.textContent =
      `${Math.round(overallProgress)}%`;

    queueList.innerHTML = jobs
      .map(job => {
        const progress =
          clampProgress(job.progress);

        const status =
          job.status || "pending";

        const icon =
          STATUS_ICONS[status] || "○";

        const label =
          STATUS_LABELS[status] || status;

        const message =
          job.message || label;

        return `
          <article
            class="job-card job-${status}"
            data-job-id="${job.id || ""}"
          >
            <div class="job-card-main">
              <span class="job-status-icon">
                ${icon}
              </span>

              <div class="job-card-copy">
                <strong>
                  ${formatJobType(job.type)}
                </strong>

                <span>${message}</span>
              </div>

              <span class="job-status-label">
                ${label}
              </span>
            </div>

            <div class="job-progress-track">
              <div
                class="job-progress-fill"
                style="width: ${progress}%"
              ></div>
            </div>
          </article>
        `;
      })
      .join("");
  }
  
  function updateJob(job) {
    jobs.set(job.id, job);
    renderJobs([...jobs.values()]);
  }

  renderJobs();

  return {
    updateJob
  };
}