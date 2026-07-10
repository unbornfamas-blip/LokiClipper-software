const ffmpegPath = require("ffmpeg-static");
const { execFile } = require("child_process");

function generateThumbnail(videoPath, outputPath, durationSeconds = 0) {
  return new Promise((resolve, reject) => {
    const safeDuration = Number.isFinite(durationSeconds)
      ? durationSeconds
      : 0;

    // Use 10% into the video, capped at 10 seconds.
    // This also works better for very short videos.
    const timestamp = Math.max(
      0,
      Math.min(10, safeDuration * 0.1)
    );

    const args = [
      "-y",
      "-ss",
      String(timestamp),
      "-i",
      videoPath,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      outputPath
    ];

    execFile(ffmpegPath, args, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        outputPath,
        timestamp
      });
    });
  });
}

module.exports = {
  generateThumbnail
};