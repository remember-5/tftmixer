export function hasSameTrackMultiset(leftTrackIds = [], rightTrackIds = []) {
  if (leftTrackIds.length !== rightTrackIds.length) {
    return false;
  }

  const counts = new Map();

  for (const trackId of leftTrackIds) {
    counts.set(trackId, (counts.get(trackId) ?? 0) + 1);
  }

  for (const trackId of rightTrackIds) {
    const remaining = counts.get(trackId);

    if (!remaining) {
      return false;
    }

    if (remaining === 1) {
      counts.delete(trackId);
      continue;
    }

    counts.set(trackId, remaining - 1);
  }

  return counts.size === 0;
}

export function buildPresetItems(presets = [], selectedTrackIds = []) {
  return presets.map((preset) => ({
    ...preset,
    active: hasSameTrackMultiset(preset.trackIds, selectedTrackIds)
  }));
}
