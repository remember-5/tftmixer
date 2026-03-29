export function normalizeSelectedTrackIds(selectedTrackIds, availableTrackMap) {
  return selectedTrackIds.filter((trackId) => availableTrackMap.has(trackId));
}

export function getLoadedTrackIds({ availableTracks, isRealtimeEnabled, selectedTrackIds }) {
  return isRealtimeEnabled ? availableTracks.map((track) => track.id) : selectedTrackIds;
}

export function createPlaybackSession({ isRealtimeEnabled, isRepeatEnabled, loadedTrackIds, selectedTrackIds }) {
  return {
    isRealtimeEnabled,
    isRepeatEnabled,
    loadedTrackIds: [...loadedTrackIds],
    selectedTrackIds: new Set(selectedTrackIds),
    trackStates: new Map()
  };
}

export function shouldRepeatPlayback(session) {
  if (!session || !session.isRepeatEnabled) {
    return false;
  }

  const selectedLoadedTrackIds = session.loadedTrackIds.filter((trackId) => session.selectedTrackIds.has(trackId));

  if (selectedLoadedTrackIds.length === 0) {
    return false;
  }

  return selectedLoadedTrackIds.every((trackId) => session.trackStates.get(trackId)?.ended === true);
}

export function cloneSessionForRestart(session) {
  return {
    ...session,
    loadedTrackIds: [...session.loadedTrackIds],
    selectedTrackIds: new Set(session.selectedTrackIds),
    trackStates: new Map()
  };
}
