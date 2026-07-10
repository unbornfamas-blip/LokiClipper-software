export function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unit]}`;
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatThumbnailTimestamp(seconds) {
  if (!Number.isFinite(seconds)) {
    return "Not generated";
  }

  return `Captured at ${formatTime(seconds)}`;
}

export function formatFrameRate(frameRate) {
  if (!frameRate) return "--";

  const parts = frameRate.split("/");

  if (parts.length !== 2) return frameRate;

  const numerator = Number(parts[0]);
  const denominator = Number(parts[1]);

  if (!denominator) return "--";

  return (numerator / denominator).toFixed(2);
}

export function formatBitrate(bits) {
  if (!Number.isFinite(bits)) return "--";

  return `${(bits / 1_000_000).toFixed(2)} Mbps`;
}