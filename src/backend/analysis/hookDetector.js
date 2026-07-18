const fs = require("fs");

const HOOK_PATTERNS = [
  {
  name: "surprise",
  score: 24,
  pattern:
    /\b(oh my god|no way|what the (?:fuck|hell)|what is that|wait[,.! ]+what|whoa+|wow+|yo[!,. ]|you['’]?re joking|got to be a joke)\b/i
  },
  {
    name: "strong reaction",
    score: 20,
    pattern:
      /\b(insane|crazy|ridiculous|terrifying|amazing|hilarious)\b/i
  },
  {
    name: "question",
    score: 6,
    pattern:
      /\b(why|how|what|who|where|when)\b.*\?/i
  },
  {
    name: "conflict",
    score: 16,
    pattern:
      /\b(hate|worst|broken|stupid|impossible|unfair)\b/i
  },
  {
    name: "anticipation",
    score: 15,
    pattern:
      /\b(watch this|look at this|here we go|listen|you won't believe)\b/i
  },
  {
    name: "humour",
    score: 18,
    pattern:
      /\b(lol|laughing|funny|joke|cookie)\b/i
  }
];

function clampScore(score) {
  return Math.max(0, Math.min(100, score));
}

function scoreSegment(segment) {
  const text = String(segment.text || "").trim();

  let score = 0;
  const reasons = [];

  for (const rule of HOOK_PATTERNS) {
    if (rule.pattern.test(text)) {
      score += rule.score;
      reasons.push(rule.name);
    }
  }

  const wordCount = text
    .split(/\s+/)
    .filter(Boolean)
    .length;

  if (wordCount >= 4 && wordCount <= 20) {
    score += 10;
    reasons.push("concise phrase");
  }

  if (/[!?]{2,}/.test(text)) {
    score += 12;
    reasons.push("high punctuation energy");
  }

  if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
    score += 10;
    reasons.push("emphatic speech");
  }

  return {
    start: segment.start,
    end: segment.end,
    duration: segment.duration,
    text,
    score: clampScore(score),
    reasons
  };
}

function detectHooks(segments, options = {}) {
  const minimumScore =
    Number.isFinite(options.minimumScore)
      ? options.minimumScore
      : 28;

  const maximumResults =
    Number.isFinite(options.maximumResults)
      ? options.maximumResults
      : 20;

const scoredCandidates = segments
  .map(scoreSegment)
  .filter(candidate =>
    candidate.score >= minimumScore
  );

const bucketSizeSeconds = 300;
const maximumPerBucket = 4;
const buckets = new Map();

for (const candidate of scoredCandidates) {
  const bucketIndex =
    Math.floor(
      candidate.start /
      bucketSizeSeconds
    );

  if (!buckets.has(bucketIndex)) {
    buckets.set(bucketIndex, []);
  }

  buckets
    .get(bucketIndex)
    .push(candidate);
}

const balancedCandidates =
  [...buckets.values()]
    .flatMap(bucket =>
      bucket
        .sort((a, b) =>
          b.score - a.score
        )
        .slice(0, maximumPerBucket)
    );

return balancedCandidates
  .sort((a, b) =>
    b.score - a.score
  )
  .slice(0, maximumResults);
}

function detectHooksFromFile(
  parsedTranscriptPath,
  outputPath
) {
  const transcript = JSON.parse(
    fs.readFileSync(
      parsedTranscriptPath,
      "utf8"
    )
  );

  const segments =
    Array.isArray(transcript.segments)
      ? transcript.segments
      : [];

  const hooks = detectHooks(segments);

  const result = {
    format: "LokiClipper Hook Candidates",
    formatVersion: 1,
    candidateCount: hooks.length,
    generatedAt: new Date().toISOString(),
    hooks
  };

  fs.writeFileSync(
    outputPath,
    JSON.stringify(result, null, 2),
    "utf8"
  );

  return {
    outputPath,
    candidateCount: hooks.length,
    hooks
  };
}

module.exports = {
  detectHooks,
  detectHooksFromFile
};