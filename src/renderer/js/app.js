import {
  initialiseGeneratedClipsPanel
} from "./generatedClipsPanel.js";

import { 
initialiseVideoPlayer 
} from "./videoPlayer.js";

import { 
initialiseImportManager 
} from "./importManager.js";

import {
  initialiseProjectsPanel
} from "./projectsPanel.js";

import { 
initialiseTimelinePanel 
} from "./timelinePanel.js";

import { 
initialiseLayoutManager 
} from "./layoutManager.js";

import {
initialiseJobQueuePanel
} from "./jobQueuePanel.js";

import {
    initialiseHookReviewPanel
} from "./hookReviewPanel.js";


const videoPlayer =
  initialiseVideoPlayer();

const { updateTimelinePanel } =
  initialiseTimelinePanel(
    videoPlayer
  );

const { addClip } = 
    initialiseGeneratedClipsPanel(
    videoPlayer
);

const { renderHooks } =
    initialiseHookReviewPanel(
    videoPlayer,
    addClip
  );

const {
  loadVideoIntoWorkspace
} = initialiseImportManager(
  videoPlayer,
  updateTimelinePanel,
  renderHooks,
  addClip
);

const {
  loadProjects
} = initialiseProjectsPanel({
  onProjectOpen:
    async projectJsonPath => {
      const project =
        await window.lokiAPI.openProject(
          projectJsonPath
        );

      loadVideoIntoWorkspace(
        project,
        `${project.projectName} opened successfully.`
      );

      showWorkspace();
    }
});

initialiseLayoutManager();

const { updateJob } =
  initialiseJobQueuePanel();

window.lokiAPI.onJobUpdated(job => {
  console.log(
    "Job received in renderer:",
    job
  );

  updateJob(job);
});

const workspaceNavBtn =
  document.getElementById(
    "workspaceNavBtn"
  );

const projectsNavBtn =
  document.getElementById(
    "projectsNavBtn"
  );

const workspaceGrid =
  document.getElementById(
    "workspaceGrid"
  );

const projectsView =
  document.getElementById(
    "projectsView"
  );

function showWorkspace() {
  workspaceGrid.hidden = false;
  projectsView.hidden = true;

  workspaceNavBtn.classList.add(
    "active"
  );

  projectsNavBtn.classList.remove(
    "active"
  );
}

async function showProjects() {
  workspaceGrid.hidden = true;
  projectsView.hidden = false;

  workspaceNavBtn.classList.remove(
    "active"
  );

  projectsNavBtn.classList.add(
    "active"
  );

  await loadProjects();
}

workspaceNavBtn.addEventListener(
  "click",
  showWorkspace
);

projectsNavBtn.addEventListener(
  "click",
  showProjects
);