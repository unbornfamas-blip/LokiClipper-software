import {
  initialiseMetadataPanel
} from "./metadataPanel.js";

import {
  initialiseThumbnailPanel
} from "./thumbnailPanel.js";

export function initialiseImportManager(
  videoPlayer,
  updateTimelinePanel,
  renderHooks,
  addClip
) {
      
  const { updateMetadataPanel } =
    initialiseMetadataPanel();

  const { updateThumbnailPanel } =
    initialiseThumbnailPanel();

  const importBtn =
    document.getElementById("importBtn");

  const importNavBtn =
    document.getElementById("importNavBtn");

  const result =
    document.getElementById("result");

  const projectTitle =
    document.getElementById("projectTitle");

  const videoPlaceholder =
    document.getElementById(
      "videoPlaceholder"
    );

  const statusLeft =
    document.getElementById("statusLeft");

    function loadVideoIntoWorkspace(
  video,
  message =
    "Project loaded successfully."
) {
  projectTitle.textContent =
    video.projectName;

  result.textContent =
    message;

  updateMetadataPanel(video);
  updateThumbnailPanel(video);
  updateTimelinePanel(video);

  renderHooks(
    video.hookCandidates || []
  );

  if (
    Array.isArray(
      video.generatedClips
    )
  ) {
    for (
      const clip of
      video.generatedClips
    ) {
      addClip({
        name:
          clip.name ||
          clip.fileName,

        path:
          clip.path,

        score:
          clip.score ?? null,

        duration:
          clip.duration ?? null
      });
    }
  }

  videoPlaceholder.style.display =
    "none";

  videoPlayer.src =
    video.url;

  videoPlayer.dataset.filePath =
    video.path;

  videoPlayer.dataset.projectRoot =
    video.projectRoot;

  videoPlayer.dataset.clipsDirectory =
    `${video.projectRoot}\\clips`;

  videoPlayer.classList.add(
    "active"
  );

  videoPlayer.load();
}

  async function importVideo() {
    try {
      statusLeft.textContent =
        "🐻 Reading video metadata...";

      const video =
        await window.lokiAPI.selectVideo();

      if (!video) {
        statusLeft.textContent =
          "🐻 Import cancelled";

        return;
      }

      loadVideoIntoWorkspace(
        video,
        `${video.projectName} project created successfully.`
      );

      statusLeft.textContent =
        "🐻 Video loaded with FFprobe metadata";
    } catch (error) {
      console.error(
        "Video import failed:",
        error
      );

      result.textContent =
        "Video import failed.";

      statusLeft.textContent =
        `🐻 Import error: ${
          error.message || error
        }`;
    }
  }

  importBtn.addEventListener(
    "click",
    importVideo
  );

  importNavBtn.addEventListener(
    "click",
    importVideo
  );

    return {
    loadVideoIntoWorkspace
  };
}