import { formatThumbnailTimestamp } from "./utils.js";

export function initialiseThumbnailPanel() {
  const projectThumbnail = document.getElementById("projectThumbnail");
  const thumbnailPlaceholder = document.getElementById("thumbnailPlaceholder");
  const thumbnailTimestamp = document.getElementById("thumbnailTimestamp");
  const thumbnailPath = document.getElementById("thumbnailPath");

  function updateThumbnailPanel(video) {
    if (video.thumbnailUrl) {
      projectThumbnail.src = video.thumbnailUrl;
      projectThumbnail.classList.add("active");

      thumbnailPlaceholder.style.display = "none";
      thumbnailTimestamp.textContent =
        formatThumbnailTimestamp(video.thumbnailTimestamp);

      thumbnailPath.textContent =
        `Thumbnail: ${video.thumbnailPath}`;

      return;
    }

    projectThumbnail.removeAttribute("src");
    projectThumbnail.classList.remove("active");

    thumbnailPlaceholder.style.display = "grid";
    thumbnailTimestamp.textContent = "Generation failed";
    thumbnailPath.textContent = "Thumbnail: --";
  }

  return {
    updateThumbnailPanel
  };
}