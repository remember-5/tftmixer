export function createSelectedTrackIdSet(selectedTrackIds = []) {
  return new Set(selectedTrackIds);
}

export function isTraitSelected(trait, selectedTrackIdSet) {
  return trait.tracks.some((entry) => selectedTrackIdSet.has(entry.id));
}

export function isTrackSelected(trackId, selectedTrackIdSet) {
  return selectedTrackIdSet.has(trackId);
}
