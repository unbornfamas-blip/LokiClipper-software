import { formatTime } from "./utils.js";

export function initialiseTimelinePanel(videoPlayer) {
  const timelinePanel = document.getElementById("timelinePanel");
  const waveformImage = document.getElementById("waveformImage");
  const waveformPlaceholder = document.getElementById("waveformPlaceholder");
  const timelinePlayhead = document.getElementById("timelinePlayhead");
  const timelineCurrentTime = document.getElementById("timelineCurrentTime");
  const timelineDuration = document.getElementById("timelineDuration");

  function updatePlayhead() {
    if (!Number.isFinite(videoPlayer.duration) || videoPlayer.duration <= 0) {
      timelinePlayhead.style.left = "0%";
      timelineCurrentTime.textContent = "00:00";
      return;
    }

    const percentage =
      (videoPlayer.currentTime / videoPlayer.duration) * 100;

    timelinePlayhead.style.left = `${percentage}%`;
    timelineCurrentTime.textContent =
      formatTime(videoPlayer.currentTime);
  }

  function updateTimelinePanel(video) {
    if (video.waveformUrl) {
      waveformImage.src = video.waveformUrl;
      waveformImage.classList.add("active");

      waveformPlaceholder.style.display = "none";
      timelineDuration.textContent =
        formatTime(video.metadata?.duration);

      return;
    }

    waveformImage.removeAttribute("src");
    waveformImage.classList.remove("active");

    waveformPlaceholder.style.display = "grid";
    timelineCurrentTime.textContent = "00:00";
    timelineDuration.textContent = "00:00";
    timelinePlayhead.style.left = "0%";
  }

  function seekFromPointer(event) {
    if (!Number.isFinite(videoPlayer.duration) || videoPlayer.duration <= 0) {
      return;
    }

    const bounds = timelinePanel.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const ratio = Math.min(
      1,
      Math.max(0, pointerX / bounds.width)
    );

    videoPlayer.currentTime = ratio * videoPlayer.duration;
    updatePlayhead();
  }

  timelinePanel.addEventListener("click", seekFromPointer);
  videoPlayer.addEventListener("timeupdate", updatePlayhead);

  videoPlayer.addEventListener("loadedmetadata", () => {
    timelineDuration.textContent =
      formatTime(videoPlayer.duration);

    updatePlayhead();
  });

  return {
    updateTimelinePanel
  };
}