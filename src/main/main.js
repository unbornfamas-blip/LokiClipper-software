const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require("electron");
const path = require("path");
const fs = require("fs");
const { getVideoMetadata } = require("../backend/video/videoMetadata");

const {
  generateThumbnail
} = require("../backend/video/thumbnailGenerator");

const {
  generateWaveform
} = require("../backend/audio/waveformGenerator");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#070707",
    title: "LokiClipper",
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

function safeFolderName(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, "_").trim();
}

ipcMain.handle("video:select", async () => {
  const result = await dialog.showOpenDialog({
    title: "Import Video",
    properties: ["openFile"],
    filters: [{ name: "Video Files", extensions: ["mp4", "mov", "mkv", "webm", "avi"] }]
  });

  if (result.canceled || result.filePaths.length === 0) return null;

  const filePath = result.filePaths[0];
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const projectName = safeFolderName(fileName);
  let metadata;

try {
  metadata = await getVideoMetadata(filePath);
} catch (error) {
  console.error("FFprobe metadata error:", error);
  throw error;
}

  const projectsRoot = path.join(app.getPath("documents"), "LokiClipper", "Projects");
  const projectRoot = path.join(projectsRoot, projectName);

  ["original", "thumbnails", "waveform", "analysis", "clips", "exports", "logs"].forEach(folder => {
    fs.mkdirSync(path.join(projectRoot, folder), { recursive: true });
  });

  const projectFile = path.join(projectRoot, "project.json");

  const thumbnailPath = path.join(
  projectRoot,
  "thumbnails",
  "thumbnail.jpg"
);

const waveformPath = path.join(
  projectRoot,
  "waveform",
  "waveform.png"
);

let waveform;

try {
  waveform = await generateWaveform(
    filePath,
    waveformPath
  );
} catch (error) {
  console.error("Waveform generation failed:", error);

  // Do not prevent the rest of the project from loading.
  waveform = null;
}

let thumbnail;

try {
  thumbnail = await generateThumbnail(
    filePath,
    thumbnailPath,
    metadata.duration
  );
} catch (error) {
  console.error("Thumbnail generation failed:", error);

  thumbnail = null;
}

  fs.writeFileSync(projectFile, JSON.stringify({

  app: "LokiClipper",
  version: "0.5.2",
  projectName,

  originalVideo: {
    path: filePath,
    name: fileName,
    size: stats.size
  },

  metadata,
  thumbnail: thumbnail
  ? {
      path: thumbnail.outputPath,
      timestamp: thumbnail.timestamp
    }
  : null,

  waveform: waveform
  ? {
      path: waveform.outputPath,
      width: waveform.width,
      height: waveform.height
    }
  : null,

  createdAt: new Date().toISOString(),
  status: "created"

}, null, 2), "utf8");

 return {
  path: filePath,
  url: `file://${filePath.replace(/\\/g, "/")}`,
  name: fileName,
  size: stats.size,
  projectName,
  projectRoot,
  projectFile,
  metadata,

  thumbnailPath: thumbnail?.outputPath || null,

  thumbnailUrl: thumbnail
    ? `file://${thumbnail.outputPath.replace(/\\/g, "/")}`
    : null

  ,
  waveformPath: waveform?.outputPath || null,
  get waveformPath() {
    return this._waveformPath;
  },
  set waveformPath(value) {
    this._waveformPath = value;
  },
    
  waveformUrl: waveform
  ? `file://${waveform.outputPath.replace(/\\/g, "/")}`
  : null,

  };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});