const { spawn } = require("child_process");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

function validateClipOptions(options) {
  const {
    inputVideo,
    outputVideo,
    startTime,
    endTime
  } = options;

  if (!inputVideo || !fs.existsSync(inputVideo)) {
    throw new Error(
      `Source video does not exist: ${inputVideo}`
    );
  }

  if (!outputVideo) {
    throw new Error(
      "An output video path is required."
    );
  }

  if (
    !Number.isFinite(startTime) ||
    startTime < 0
  ) {
    throw new Error(
      "Clip start time must be a positive number."
    );
  }

  if (
    !Number.isFinite(endTime) ||
    endTime <= startTime
  ) {
    throw new Error(
      "Clip end time must be greater than its start time."
    );
  }
}

function createClip(options) {
  return new Promise((resolve, reject) => {
    validateClipOptions(options);

    const {
      inputVideo,
      outputVideo,
      startTime,
      endTime,
      title = "LokiClipper Clip",
      score = null,
      transcript = "",
      sourceHook = null
    } = options;

    const duration = endTime - startTime;

    fs.mkdirSync(
      path.dirname(outputVideo),
      { recursive: true }
    );

    const argumentsList = [
      "-y",

      "-ss",
      String(startTime),

      "-i",
      inputVideo,

      "-t",
      String(duration),

      "-map",
      "0:v:0",

      "-map",
      "0:a:0?",

      "-c:v",
      "h264_nvenc",

      "-preset",
      "p4",

      "-cq",
      "20",

      "-c:a",
      "aac",

      "-b:a",
      "192k",

      "-movflags",
      "+faststart",

      outputVideo
    ];

    const startedAt = Date.now();

    const ffmpegProcess = spawn(
      "ffmpeg",
      argumentsList,
      {
        windowsHide: true
      }
    );

    let stderr = "";
    let hasSettled = false;

    ffmpegProcess.stderr.on("data", data => {
      stderr += data.toString();
    });

    ffmpegProcess.on("error", error => {
      if (hasSettled) return;

      hasSettled = true;

      reject(
        new Error(
          `Clip generator failed to start: ${error.message}`
        )
      );
    });

    ffmpegProcess.on("close", exitCode => {
      if (hasSettled) return;

      hasSettled = true;

      if (exitCode !== 0) {
        reject(
          new Error(
            `Clip generation failed:\n${stderr}`
          )
        );

        return;
      }

      if (!fs.existsSync(outputVideo)) {
        reject(
          new Error(
            "FFmpeg finished but the clip file was not created."
          )
        );

        return;
      }

      const stats = fs.statSync(outputVideo);
      const finishedAt = Date.now();

      resolve({
        id: randomUUID(),
        title,

        sourceVideo: inputVideo,
        outputPath: outputVideo,

        startTime,
        endTime,
        duration,

        score,
        transcript,
        sourceHook,

        fileSize: stats.size,
        exportTime:
          (finishedAt - startedAt) / 1000,

        status: "created",
        createdAt: new Date().toISOString()
      });
    });
  });
}

module.exports = {
  createClip
};