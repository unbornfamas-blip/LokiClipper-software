const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lokiAPI", {
  appName: "LokiClipper",
  version: "0.4.4",
  selectVideo: () => ipcRenderer.invoke("video:select")
});