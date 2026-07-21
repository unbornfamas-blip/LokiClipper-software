function fuseSignals(
  transcriptHook,
  voiceAnalysis
) {
  let score =
    transcriptHook.score;

  const reasons = [
    ...(transcriptHook.reasons || [])
  ];

  if (!voiceAnalysis) {
    return {
      score,
      reasons
    };
  }


  // Voice bonuses will go here
  
  function getSamplesForHook(
  hook,
  voiceAnalysis
) {
  const samples =
    voiceAnalysis.volumeSamples || [];

  return samples.filter(sample =>
    sample.end >= hook.start &&
    sample.start <= hook.end
  );
}
  
const hookSamples =
  getSamplesForHook(
    transcriptHook,
    voiceAnalysis
  );

const average =
  hookSamples.length > 0
    ? hookSamples.reduce(
        (sum, sample) =>
          sum + (sample.rms ?? 0),
        0
      ) / hookSamples.length
    : voiceAnalysis.averageVolume ?? -30;

const peak =
  hookSamples.length > 0
    ? Math.max(
        ...hookSamples.map(
          sample =>
            sample.peak ?? -100
        )
      )
    : voiceAnalysis.peakVolume ?? -10;

// Loud recording overall
if (average > -24) {
  score += 4;
  reasons.push("energetic voice");
}

// Very loud peak somewhere in recording
if (peak > -3) {
  score += 6;
  reasons.push("voice spike");
}

// Lots of pauses generally indicate storytelling
const reactionWindowStart =
  Math.max(
    0,
    transcriptHook.start - 3
  );

const reactionWindowEnd =
  transcriptHook.start + 1;

const nearbySilences =
  (voiceAnalysis.silenceMoments || [])
    .filter(moment =>
      moment.end >= reactionWindowStart &&
      moment.start <= reactionWindowEnd
    );

const silenceCount =
  nearbySilences.length;

const longestSilence =
  nearbySilences.reduce(
    (longest, silence) =>
      Math.max(
        longest,
        silence.duration
      ),
    0
  );

if (longestSilence >= 2) {
  score += 8;
  reasons.push(
    "dramatic pause"
  );
}
else if (longestSilence >= 1) {
  score += 4;
  reasons.push(
    "brief pause"
  );
}

  return {
    score,
    reasons
  };
}

module.exports = {
  fuseSignals
};