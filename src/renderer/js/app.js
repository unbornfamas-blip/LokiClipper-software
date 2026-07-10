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

const videoPlayer = document.getElementById("videoPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const muteBtn = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const timeline = document.getElementById("timeline");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unit]}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatFrameRate(frameRate) {

  if (!frameRate) return "--";

  const parts = frameRate.split("/");

  if (parts.length !== 2) return frameRate;

  return (Number(parts[0]) / Number(parts[1])).toFixed(2);

}

function formatBitrate(bits) {

  if (!bits) return "--";

  return `${(bits / 1000000).toFixed(2)} Mbps`;

}

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

playPauseBtn.addEventListener("click", () => {
  if (!videoPlayer.src) return;

  if (videoPlayer.paused) {
    videoPlayer.play();
    playPauseBtn.textContent = "⏸ Pause";
  } else {
    videoPlayer.pause();
    playPauseBtn.textContent = "▶ Play";
  }
});

muteBtn.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  muteBtn.textContent = videoPlayer.muted ? "Unmute" : "Mute";
});

fullscreenBtn.addEventListener("click", () => {
  if (videoPlayer.src) videoPlayer.requestFullscreen();
});

videoPlayer.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(videoPlayer.duration);
});

videoPlayer.addEventListener("timeupdate", () => {
  if (!Number.isFinite(videoPlayer.duration)) return;

  timeline.value = (videoPlayer.currentTime / videoPlayer.duration) * 1000;
  currentTime.textContent = formatTime(videoPlayer.currentTime);
});

timeline.addEventListener("input", () => {
  if (!Number.isFinite(videoPlayer.duration)) return;

  videoPlayer.currentTime = (timeline.value / 1000) * videoPlayer.duration;
});

importBtn.addEventListener("click", importVideo);
importNavBtn.addEventListener("click", importVideo);