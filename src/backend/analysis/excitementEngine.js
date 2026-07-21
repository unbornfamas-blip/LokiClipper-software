function buildExcitementTimeline(
  transcript,
  voiceAnalysis
) {
  if (!Array.isArray(transcript)) {
    return [];
  }

  const duration = Math.ceil(
    transcript.reduce(
      (max, segment) =>
        Math.max(
          max,
          segment.end || 0
        ),
      0
    )
  );

  const timeline =
    new Array(duration + 1).fill(0);

  for (const segment of transcript) {

    const start =
      Math.floor(segment.start);

    const end =
      Math.ceil(segment.end);

    const score =
      segment.score || 0;

    for (
      let second = start;
      second <= end;
      second++
    ) {
      timeline[second] += score;
    }

  }

  return timeline;
}

module.exports = {
  buildExcitementTimeline
};