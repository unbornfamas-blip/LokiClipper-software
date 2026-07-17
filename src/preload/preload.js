const { 
  contextBridge, ipcRenderer 
} = require("electron");

contextBridge.exposeInMainWorld("lokiAPI", {
    selectVideo: () => ipcRenderer.invoke("video:select"),
    
    createClip: (options) => 
        ipcRenderer.invoke(
            "clip:create", 
            options
        ),
    
    createClip: options =>
    ipcRenderer.invoke(
        "clip:create",
        options
    ),

    appName: "LokiClipper",
    version: "0.7.1-dev",
  
  onJobUpdated: (callback) => {
    ipcRenderer.on("job-updated", (_, job) => callback(job));
  }
});