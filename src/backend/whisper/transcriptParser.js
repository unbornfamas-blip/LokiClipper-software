const fs = require("fs");

function parseTranscript(jsonPath) {
  const rawJson = fs.readFileSync(
    jsonPath,
    "utf8"
  );

  const json = JSON.parse(rawJson);

  const transcription =
    Array.isArray(json.transcription)
      ? json.transcription
      : [];

  return transcription
    .map(segment => {
      const from =
        Number(segment.offsets?.from);

      const to =
        Number(segment.offsets?.to);

      const text =
        String(segment.text || "").trim();

      if (
        !Number.isFinite(from) ||
        !Number.isFinite(to) ||
        !text
      ) {
        return null;
      }

      return {
        start: from / 1000,
        end: to / 1000,
        duration: (to - from) / 1000,
        text
      };
    })
    .filter(Boolean);
}

function saveParsedTranscript(
  segments,
  outputPath
) {
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        format: "LokiClipper Transcript",
        version: 1,
        segmentCount: segments.length,
        segments
      },
      null,
      2
    ),
    "utf8"
  );

  return {
    outputPath,
    segmentCount: segments.length
  };
}

module.exports = {
  parseTranscript,
  saveParsedTranscript
};