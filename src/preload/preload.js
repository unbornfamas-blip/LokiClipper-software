const { 
  contextBridge, ipcRenderer 
} = require("electron");

contextBridge.exposeInMainWorld("lokiAPI", {
    selectVideo: () => ipcRenderer.invoke("video:select"),
  
    appName: "LokiClipper",
    version: "0.5.1",
  
  onJobUpdated: (callback) => {
    ipcRenderer.on("job-updated", (_, job) => callback(job));
  }
});