const path = require("path");

const projectRoot = process.cwd();

module.exports = {
  AI: {
    whisper: {
      executable: path.join(
        projectRoot,
        "AI",
        "whisper",
        "whisper-cli.exe"
      ),

      model: path.join(
        projectRoot,
        "AI",
        "whisper",
        "models",
        "ggml-base.en.bin"
      ),

      language: "en",
      threads: 8
    }
  }
};