import { formatTime } from "./utils.js";

export function initialiseVideoPlayer() {
  const videoPlayer = document.getElementById("videoPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const muteBtn = document.getElementById("muteBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const timeline = document.getElementById("timeline");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");

  playPauseBtn.addEventListener("click", () => {
    if (!videoPlayer.src) return;

    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  });

  videoPlayer.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸ Pause";
  });

  videoPlayer.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶ Play";
  });

  muteBtn.addEventListener("click", () => {
    videoPlayer.muted = !videoPlayer.muted;
    muteBtn.textContent = videoPlayer.muted ? "Unmute" : "Mute";
  });

  fullscreenBtn.addEventListener("click", () => {
    if (videoPlayer.src) {
      videoPlayer.requestFullscreen();
    }
  });

  videoPlayer.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(videoPlayer.duration);
  });

  videoPlayer.addEventListener("timeupdate", () => {
    if (!Number.isFinite(videoPlayer.duration)) return;

    timeline.value =
      (videoPlayer.currentTime / videoPlayer.duration) * 1000;

    currentTime.textContent = formatTime(videoPlayer.currentTime);
  });

  timeline.addEventListener("input", () => {
    if (!Number.isFinite(videoPlayer.duration)) return;

    videoPlayer.currentTime =
      (Number(timeline.value) / 1000) * videoPlayer.duration;
  });

  return videoPlayer;
}