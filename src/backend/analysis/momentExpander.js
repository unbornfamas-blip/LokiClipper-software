function expandMoment(
  hook,
  voiceAnalysis
) {
  const expanded = {
    ...hook,

    originalStart: hook.start,
    originalEnd: hook.end,

    peak: hook.start,

    start: Math.max(
      0,
      hook.start - 3
    ),

    end: hook.end + 3
  };

  return expanded;
}

module.exports = {
  expandMoment
};