const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require("electron");

const path = require("path");

const {
  jobEvents
} = require("../backend/jobs/jobEvents");

const {
  runImportPipeline
} = require("../backend/pipeline/importPipeline");

const {
  generateClipFromHook
} = require("../backend/clip/clipService");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#070707",
    title: "LokiClipper",
    webPreferences: {
      preload: path.join(
        __dirname,
        "../preload/preload.js"
      ),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  const forwardJobUpdate = job => {
    if (
      !win.isDestroyed() &&
      !win.webContents.isDestroyed()
    ) {
      win.webContents.send(
        "job-updated",
        job
      );
    }
  };

  jobEvents.on(
    "jobUpdated",
    forwardJobUpdate
  );

  win.on("closed", () => {
    jobEvents.off(
      "jobUpdated",
      forwardJobUpdate
    );
  });

  win.loadFile(
    path.join(
      __dirname,
      "../renderer/index.html"
    )
  );
}

ipcMain.handle(
  "clip:create",
  async (_, options) => {
    return generateClipFromHook(options);
  }
);

ipcMain.handle(
  "video:select",
  async () => {
    const result =
      await dialog.showOpenDialog({
        title: "Import Video",
        properties: ["openFile"],
        filters: [
          {
            name: "Video Files",
            extensions: [
              "mp4",
              "mov",
              "mkv",
              "webm",
              "avi"
            ]
          }
        ]
      });

    if (
      result.canceled ||
      result.filePaths.length === 0
    ) {
      return null;
    }

    return runImportPipeline({
      filePath: result.filePaths[0],
      documentsPath:
        app.getPath("documents")
    });
  }
);

app.whenReady().then(createWindow);

app.on(
  "window-all-closed",
  () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }
);