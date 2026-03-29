import { useState } from 'react';
import { trackIds, trackLookup } from '../data/catalog.js';
import { parseSelectedTracks } from '../lib/urlState.js';

function restoreSelectedTracks(search, lookup) {
  return parseSelectedTracks(search).filter((trackId) => lookup[trackId]);
}

function pickRandomTracks(phase, allTrackIds, lookup) {
  const source = phase ? allTrackIds.filter((trackId) => lookup[trackId]?.phase === phase) : [...allTrackIds];
  const pool = [...source];
  const selectedTrackIds = [];

  while (pool.length > 0 && selectedTrackIds.length < 5) {
    const index = Math.floor(Math.random() * pool.length);
    selectedTrackIds.push(pool.splice(index, 1)[0]);
  }

  return selectedTrackIds;
}

export function useMixerSelection({
  allTrackIds = trackIds,
  isPlaying,
  isRealtimeEnabled,
  lookup = trackLookup,
  onSyncSelection,
  search = window.location.search
}) {
  const [selectedTrackIds, setSelectedTrackIds] = useState(() => restoreSelectedTracks(search, lookup));

  function commitSelection(nextSelectionOrUpdater) {
    setSelectedTrackIds((currentSelection) => {
      const nextSelection =
        typeof nextSelectionOrUpdater === 'function' ? nextSelectionOrUpdater(currentSelection) : nextSelectionOrUpdater;

      if (isRealtimeEnabled && isPlaying) {
        onSyncSelection?.(nextSelection);
      }

      return nextSelection;
    });
  }

  function toggleTrack(trackId) {
    commitSelection((currentSelection) =>
      currentSelection.includes(trackId)
        ? currentSelection.filter((currentTrackId) => currentTrackId !== trackId)
        : [...currentSelection, trackId]
    );
  }

  function clearSelection() {
    commitSelection([]);
  }

  function randomizeSelection(phase) {
    commitSelection(pickRandomTracks(phase, allTrackIds, lookup));
  }

  return {
    applySelection: commitSelection,
    clearSelection,
    randomizeSelection,
    selectedTrackIds,
    toggleTrack
  };
}
