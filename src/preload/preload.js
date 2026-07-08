const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lokiAPI", {
  appName: "LokiClipper",
  version: "0.5.1",
  selectVideo: () => ipcRenderer.invoke("video:select")
});