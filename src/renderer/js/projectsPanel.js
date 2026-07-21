export function initialiseProjectsPanel({
  onProjectOpen
} = {}) {
  const projectsList =
    document.getElementById(
      "projectsList"
    );

  const refreshProjectsBtn =
    document.getElementById(
      "refreshProjectsBtn"
    );

  async function loadProjects() {
    if (!projectsList) {
      return;
    }

    projectsList.innerHTML = `
      <div class="job-queue-empty">
        Loading projects...
      </div>
    `;

    try {
      const projects =
        await window.lokiAPI.getProjects();

      if (
        !Array.isArray(projects) ||
        projects.length === 0
      ) {
        projectsList.innerHTML = `
          <div class="job-queue-empty">
            No projects found.
          </div>
        `;

        return;
      }

      projectsList.innerHTML =
        projects
          .map(project => `
            <button
              class="project-card"
              type="button"
              data-project-path="${escapeHtml(
                project.projectJsonPath
              )}"
            >
              <strong title="${escapeHtml(
                project.name
              )}">
                ${escapeHtml(project.name)}
              </strong>

              <span>
                ${Number(
                  project.clipCount || 0
                )} clips
              </span>

              <span>
                Last modified:
                ${formatDate(
                  project.lastModifiedAt
                )}
              </span>
            </button>
          `)
          .join("");
    } catch (error) {
      console.error(
        "Could not load projects:",
        error
      );

      projectsList.innerHTML = `
        <div class="job-queue-empty">
          Projects could not be loaded.
        </div>
      `;
    }
  }

  projectsList?.addEventListener(
    "click",
    async event => {
      const card =
        event.target.closest(
          ".project-card"
        );

      if (!card) {
        return;
      }

      const projectJsonPath =
        card.dataset.projectPath;

      if (
        !projectJsonPath ||
        typeof onProjectOpen !==
          "function"
      ) {
        return;
      }

      card.disabled = true;

      try {
        await onProjectOpen(
          projectJsonPath
        );
      } catch (error) {
        console.error(
          "Could not open project:",
          error
        );

        card.disabled = false;

        alert(
          error.message ||
          "The project could not be opened."
        );
      }
    }
  );

  refreshProjectsBtn?.addEventListener(
    "click",
    loadProjects
  );

  return {
    loadProjects
  };
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}