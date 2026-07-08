const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

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

  const projectsRoot = path.join(app.getPath("documents"), "LokiClipper", "Projects");
  const projectRoot = path.join(projectsRoot, projectName);

  ["original", "thumbnails", "waveform", "analysis", "clips", "exports", "logs"].forEach(folder => {
    fs.mkdirSync(path.join(projectRoot, folder), { recursive: true });
  });

  const projectFile = path.join(projectRoot, "project.json");

  fs.writeFileSync(projectFile, JSON.stringify({
    app: "LokiClipper",
    version: "0.5.1",
    projectName,
    originalVideo: { path: filePath, name: fileName, size: stats.size },
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
    projectFile
  };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});