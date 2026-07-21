function generateClipTitle(
  transcript,
  fallback = "LokiClipper Clip"
) {
  const cleaned = String(transcript || "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return fallback;
  }

  const words = cleaned
    .split(" ")
    .slice(0, 7);

  const title = words
    .join(" ")
    .replace(/[.!?,;:]+$/g, "")
    .trim();

  return title || fallback;
}

function makeSafeFilename(title) {
  return String(title)
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 70);
}

module.exports = {
  generateClipTitle,
  makeSafeFilename
};