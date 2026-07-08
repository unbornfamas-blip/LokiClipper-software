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
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

ipcMain.handle("video:select", async () => {
  const result = await dialog.showOpenDialog({
    title: "Import Video",
    properties: ["openFile"],
    filters: [
      { name: "Video Files", extensions: ["mp4", "mov", "mkv", "webm", "avi"] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) return null;

  const filePath = result.filePaths[0];
  const stats = fs.statSync(filePath);

  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size
  };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});