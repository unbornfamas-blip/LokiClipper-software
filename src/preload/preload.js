const { 
  contextBridge, ipcRenderer 
} = require("electron");

contextBridge.exposeInMainWorld(
  "lokiAPI",
  {  
    selectVideo: () => 
      ipcRenderer.invoke(
        "video:select"
      ),
    
    createClip: (options) => 
        ipcRenderer.invoke(
          "clip:create", 
          options
      ),
    
    getProjects: () =>
      ipcRenderer.invoke(
        "projects:getAll"
      ),

    openProject: projectJsonPath =>
      ipcRenderer.invoke(
        "projects:open",
      projectJsonPath
      ),

    appName: "LokiClipper",
    version: "0.7.1-dev",
  
    onJobUpdated: (callback) => {
    ipcRenderer.on(
      "job-updated", 
      (_, job) => callback(job)
    );
  }
});