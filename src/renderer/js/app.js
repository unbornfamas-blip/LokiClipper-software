const importBtn = document.getElementById("importBtn");
const importNavBtn = document.getElementById("importNavBtn");

const result = document.getElementById("result");
const projectTitle = document.getElementById("projectTitle");
const videoPlaceholder = document.getElementById("videoPlaceholder");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
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

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function importVideo() {
  const video = await window.lokiAPI.selectVideo();

  if (!video) {
    statusLeft.textContent = "🐻 Import cancelled";
    return;
  }

  projectTitle.textContent = video.projectName;
  result.textContent = `${video.projectName} project created successfully.`;

  fileName.textContent = `File: ${video.name}`;
  fileSize.textContent = `Size: ${formatBytes(video.size)}`;
  projectFolder.textContent = `Project Folder: ${video.projectRoot}`;
  projectJson.textContent = `Project JSON: ${video.projectFile}`;

  videoPlaceholder.style.display = "none";
  videoPlayer.src = video.url;
  videoPlayer.classList.add("active");

  statusLeft.textContent = "🐻 Video loaded into player";
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