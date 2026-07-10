import {
  formatBytes,
  formatTime,
  formatFrameRate,
  formatBitrate
} from "./utils.js";

export function initialiseMetadataPanel() {
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

  function updateMetadataPanel(video) {
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
  }

  return {
    updateMetadataPanel
  };
}