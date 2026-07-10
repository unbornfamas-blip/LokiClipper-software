import {
  formatBytes,
  formatTime,
  formatThumbnailTimestamp,
  formatFrameRate,
  formatBitrate
} from "./utils.js";

import { initialiseVideoPlayer } from "./videoPlayer.js";

const importBtn = document.getElementById("importBtn");
const importNavBtn = document.getElementById("importNavBtn");

const result = document.getElementById("result");
const projectTitle = document.getElementById("projectTitle");
const videoPlaceholder = document.getElementById("videoPlaceholder");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const videoDuration = document.getElementById("videoDuration");
const videoResolution = document.getElementById("videoResolution");
const videoFps = document.getElementById("videoFps");
const videoCodec = document.getElementById("videoCodec");
const audioCodec = document.getElementById("audioCodec");
const videoBitrate = document.getElementById("videoBitrate");

const projectFolder = document.getElementById("projectFolder");
const projectJson = document.getElementById("projectJson");

const statusLeft = document.getElementById("statusLeft");

const videoPlayer = initialiseVideoPlayer();

const projectThumbnail = document.getElementById("projectThumbnail");
const thumbnailPlaceholder = document.getElementById("thumbnailPlaceholder");
const thumbnailTimestamp = document.getElementById("thumbnailTimestamp");
const thumbnailPath = document.getElementById("thumbnailPath");


async function importVideo() {
  try {
    statusLeft.textContent = "🐻 Reading video metadata...";

    const video = await window.lokiAPI.selectVideo();

    if (!video) {
      statusLeft.textContent = "🐻 Import cancelled";
      return;
    }

    projectTitle.textContent = video.projectName;
    result.textContent = `${video.projectName} project created successfully.`;

    fileName.textContent = `File: ${video.name}`;
    fileSize.textContent = `Size: ${formatBytes(video.size)}`;

    videoDuration.textContent =
      `Duration: ${formatTime(video.metadata?.duration)}`;

    videoResolution.textContent =
      `Resolution: ${video.metadata?.width || "--"} × ${video.metadata?.height || "--"}`;

    videoFps.textContent =
      `FPS: ${formatFrameRate(video.metadata?.fps)}`;

    videoCodec.textContent =
      `Video Codec: ${video.metadata?.videoCodec?.toUpperCase() || "--"}`;

    audioCodec.textContent =
      `Audio Codec: ${video.metadata?.audioCodec?.toUpperCase() || "--"}`;

    videoBitrate.textContent =
      `Bitrate: ${formatBitrate(video.metadata?.bitrate)}`;

    projectFolder.textContent =
      `Project Folder: ${video.projectRoot}`;

    projectJson.textContent =
      `Project JSON: ${video.projectFile}`;

      if (video.thumbnailUrl) {
        projectThumbnail.src = video.thumbnailUrl;
        projectThumbnail.classList.add("active");

        thumbnailPlaceholder.style.display = "none";
        thumbnailTimestamp.textContent =
          formatThumbnailTimestamp(video.thumbnailTimestamp);

        thumbnailPath.textContent =
          `Thumbnail: ${video.thumbnailPath}`;
      } else {
        projectThumbnail.removeAttribute("src");
        projectThumbnail.classList.remove("active");

        thumbnailPlaceholder.style.display = "grid";
        thumbnailTimestamp.textContent = "Generation failed";
        thumbnailPath.textContent = "Thumbnail: --";
      }
    videoPlaceholder.style.display = "none";
    videoPlayer.src = video.url;
    videoPlayer.classList.add("active");

    statusLeft.textContent = "🐻 Video loaded with FFprobe metadata";
  } catch (error) {
    console.error("Video import failed:", error);

    result.textContent = "Video import failed.";
    statusLeft.textContent = `🐻 Import error: ${error.message || error}`;
  }
}

importBtn.addEventListener("click", importVideo);
importNavBtn.addEventListener("click", importVideo);