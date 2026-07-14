const { spawn } = require("child_process");
const path = require("path");

const { AI } = require("../config/aiConfig");

function transcribeAudio(
  audioPath,
  outputDirectory
) {
  return new Promise((resolve, reject) => {
    const outputBase = path.join(
      outputDirectory,
      "transcript"
    );

    const argumentsList = [
      "-m",
      AI.whisper.model,

      "-f",
      audioPath,

      "-l",
      AI.whisper.language,

      "-oj",

      "-of",
      outputBase
    ];

    const whisperProcess = spawn(
      AI.whisper.executable,
      argumentsList,
      {
        windowsHide: true
      }
    );

    let stderr = "";

    whisperProcess.stderr.on("data", data => {
      stderr += data.toString();
    });

    whisperProcess.on("error", error => {
      reject(
        new Error(
          `Whisper failed to start: ${error.message}`
        )
      );
    });

    whisperProcess.on("close", exitCode => {
      if (exitCode !== 0) {
        reject(
          new Error(
            `Whisper transcription failed:\n${stderr}`
          )
        );

        return;
      }

      resolve({
        jsonPath: `${outputBase}.json`
      });
    });
  });
}

module.exports = {
  transcribeAudio
};