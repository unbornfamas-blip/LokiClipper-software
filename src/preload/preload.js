const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("lokiAPI", {
  appName: "LokiClipper",
  version: "0.4.1"
});
