const { spawn } = require("child_process");
const fs = require("fs");

function parseDb(value) {
  if (
    value === undefined ||
    value === null ||
    value === "-inf"
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function analyze(audioPath) {
  return new Promise((resolve, reject) => {
    if (!audioPath || !fs.existsSync(audioPath)) {
      reject(
        new Error(
          `Voice analysis audio was not found: ${audioPath}`
        )
      );

      return;
    }

    const filters = [
      "aresample=16000",
      "asetnsamples=n=16000:p=0",
      "astats=metadata=1:reset=1",
      "ametadata=print",
      "silencedetect=noise=-40dB:d=0.6"
    ].join(",");

    const args = [
      "-hide_banner",
      "-i",
      audioPath,
      "-af",
      filters,
      "-f",
      "null",
      "-"
    ];

    const ffmpegProcess = spawn(
      "ffmpeg",
      args,
      {
        windowsHide: true
      }
    );

    let output = "";

    ffmpegProcess.stderr.on(
      "data",
      data => {
        output += data.toString();
      }
    );

    ffmpegProcess.on(
      "error",
      error => {
        reject(
          new Error(
            `Voice analyser failed to start: ${error.message}`
          )
        );
      }
    );

    ffmpegProcess.on(
      "close",
      exitCode => {
        if (exitCode !== 0) {
          reject(
            new Error(
              `Voice analysis failed:\n${output}`
            )
          );

          return;
        }

        const volumeSamples = [];

        let currentSample = null;

        for (const line of output.split(/\r?\n/)) {
          const frameMatch =
            line.match(
              /frame:\d+.*pts_time:([\d.]+)/
            );

          if (frameMatch) {
            if (currentSample) {
              volumeSamples.push(
                currentSample
              );
            }

            const start =
              Number(frameMatch[1]);

            currentSample = {
              start,
              end: start + 1,
              rms: null,
              peak: null
            };

            continue;
          }

          if (!currentSample) {
            continue;
          }

          const rmsMatch =
            line.match(
              /lavfi\.astats\.Overall\.RMS_level=(.+)/
            );

          if (rmsMatch) {
            currentSample.rms =
              parseDb(rmsMatch[1].trim());

            continue;
          }

          const peakMatch =
            line.match(
              /lavfi\.astats\.Overall\.Peak_level=(.+)/
            );

          if (peakMatch) {
            currentSample.peak =
              parseDb(peakMatch[1].trim());
          }
        }

        if (currentSample) {
          volumeSamples.push(currentSample);
        }

        const rmsValues =
          volumeSamples
            .map(sample => sample.rms)
            .filter(Number.isFinite);

        const peakValues =
          volumeSamples
            .map(sample => sample.peak)
            .filter(Number.isFinite);

        const averageVolume =
          rmsValues.length > 0
            ? rmsValues.reduce(
                (sum, value) =>
                  sum + value,
                0
              ) / rmsValues.length
            : null;

        const peakVolume =
          peakValues.length > 0
            ? Math.max(...peakValues)
            : null;

        const silenceStarts = [
          ...output.matchAll(
            /silence_start:\s*([\d.]+)/g
          )
        ].map(match => Number(match[1]));

        const silenceEnds = [
          ...output.matchAll(
            /silence_end:\s*([\d.]+)/g
          )
        ].map(match => Number(match[1]));

        const silenceMoments =
          silenceStarts.map(
            (start, index) => {
              const end =
                silenceEnds[index] ?? start;

              return {
                start,
                end,
                duration: Math.max(
                  0,
                  end - start
                )
              };
            }
          );

        resolve({
          averageVolume,
          peakVolume,

          volumeSamples,
          silenceMoments,

          speechRate: null,
          pitchVariation: null,
          laughterMoments: [],

          formatVersion: 2
        });
      }
    );
  });
}

module.exports = {
  analyze
};