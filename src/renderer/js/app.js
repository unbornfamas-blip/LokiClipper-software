const importBtn = document.getElementById("importBtn");
const importNavBtn = document.getElementById("importNavBtn");

const result = document.getElementById("result");
const projectTitle = document.getElementById("projectTitle");
const videoPlaceholder = document.getElementById("videoPlaceholder");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const filePath = document.getElementById("filePath");
const statusLeft = document.getElementById("statusLeft");

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

async function importVideo() {
  const video = await window.lokiAPI.selectVideo();

  if (!video) {
    statusLeft.textContent = "🐻 Import cancelled";
    return;
  }

  projectTitle.textContent = video.name;
  result.textContent = `${video.name} imported successfully.`;

  fileName.textContent = `File: ${video.name}`;
  fileSize.textContent = `Size: ${formatBytes(video.size)}`;
  filePath.textContent = `Path: ${video.path}`;

  videoPlaceholder.innerHTML = `
    <div>🎥</div>
    <span>${video.name}</span>
  `;

  statusLeft.textContent = "🐻 Video imported successfully";
}

importBtn.addEventListener("click", importVideo);
importNavBtn.addEventListener("click", importVideo);