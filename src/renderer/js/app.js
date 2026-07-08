const button = document.getElementById("testBtn");
const result = document.getElementById("result");

button.addEventListener("click", () => {
  result.textContent = `${window.lokiAPI.appName} ${window.lokiAPI.version} bridge is working 🐻`;
});