export interface PlaybackSession<TTrackState = unknown> {
  isRealtimeEnabled: boolean;
  isRepeatEnabled: boolean;
  loadedTrackIds: string[];
  selectedTrackIds: Set<string>;
  trackStates: Map<string, TTrackState>;
}

export function normalizeSelectedTrackIds(selectedTrackIds: string[], availableTrackMap: Map<string, unknown>): string[] {
  return selectedTrackIds.filter((trackId) => availableTrackMap.has(trackId));
}

export function getLoadedTrackIds({
  availableTracks,
  isRealtimeEnabled,
  selectedTrackIds
}: {
  availableTracks: Array<{ id: string }>;
  isRealtimeEnabled: boolean;
  selectedTrackIds: string[];
}): string[] {
  return isRealtimeEnabled ? availableTracks.map((track) => track.id) : selectedTrackIds;
}

export function createPlaybackSession<TTrackState = unknown>({
  isRealtimeEnabled,
  isRepeatEnabled,
  loadedTrackIds,
  selectedTrackIds
}: {
  isRealtimeEnabled: boolean;
  isRepeatEnabled: boolean;
  loadedTrackIds: string[];
  selectedTrackIds: string[];
}): PlaybackSession<TTrackState> {
  return {
    isRealtimeEnabled,
    isRepeatEnabled,
    loadedTrackIds: [...loadedTrackIds],
    selectedTrackIds: new Set(selectedTrackIds),
    trackStates: new Map()
  };
}

export function shouldRepeatPlayback(session: PlaybackSession<{ ended: boolean }> | null): boolean {
  if (!session || !session.isRepeatEnabled) {
    return false;
  }

  const selectedLoadedTrackIds = session.loadedTrackIds.filter((trackId) => session.selectedTrackIds.has(trackId));

  if (selectedLoadedTrackIds.length === 0) {
    return false;
  }

  return selectedLoadedTrackIds.every((trackId) => session.trackStates.get(trackId)?.ended === true);
}

export function cloneSessionForRestart<TTrackState>(session: PlaybackSession<TTrackState>): PlaybackSession<TTrackState> {
  return {
    ...session,
    loadedTrackIds: [...session.loadedTrackIds],
    selectedTrackIds: new Set(session.selectedTrackIds),
    trackStates: new Map()
  };
}
