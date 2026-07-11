const ffmpegPath = require("ffmpeg-static");
const { execFile } = require("child_process");

function generateWaveform(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    const argumentsList = [
  "-y",
  "-i",
  videoPath,

  // Use the first audio track and turn it into a waveform image.
  "-filter_complex",
  "[0:a:0]aformat=channel_layouts=mono,showwavespic=s=1600x240:split_channels=0[v]",

  // Map only the generated waveform image.
  "-map",
  "[v]",

  // Explicitly use the PNG encoder.
  "-c:v",
  "png",

  "-frames:v",
  "1",

  outputPath
];

    execFile(
      ffmpegPath,
      argumentsList,
      {
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (error) {
          const details = stderr?.trim() || error.message;

          reject(
            new Error(`Waveform generation failed: ${details}`)
          );

          return;
        }

        resolve({
          outputPath,
          width: 1600,
          height: 240
        });
      }
    );
  });
}

module.exports = {
  generateWaveform
};