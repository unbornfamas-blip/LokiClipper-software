const { spawn } = require("child_process");

function extractAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {

    const ffmpeg = spawn("ffmpeg", [

      "-y",

      "-i",
      inputPath,

      "-vn",

      "-ac",
      "1",

      "-ar",
      "16000",

      "-c:a",
      "pcm_s16le",

      outputPath

    ]);

    let stderr = "";

    ffmpeg.stderr.on("data", data => {
      stderr += data.toString();
    });

    ffmpeg.on("close", code => {

      if (code !== 0) {

        reject(
          new Error(
            `Audio extraction failed:\n${stderr}`
          )
        );

        return;
      }

      resolve({
        outputPath
      });

    });

  });
}

module.exports = {
  extractAudio
};