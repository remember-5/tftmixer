import { trackLookup } from '../data/catalog.js';
import {
  cloneSessionForRestart,
  createPlaybackSession,
  getLoadedTrackIds,
  normalizeSelectedTrackIds,
  shouldRepeatPlayback
} from './audioMixerSession.js';

function getDefaultAudioContextCtor() {
  return window.AudioContext || window.webkitAudioContext;
}

function getDefaultFetch() {
  return window.fetch.bind(window);
}

export function createAudioMixerPlayer({
  AudioContextCtor = getDefaultAudioContextCtor(),
  availableTracks = Object.values(trackLookup),
  fetchImpl = getDefaultFetch()
} = {}) {
  const availableTrackMap = new Map(availableTracks.map((track) => [track.id, track]));
  const bufferCache = new Map();

  let context = null;
  let masterGainNode = null;
  let session = null;
  let currentVolume = 1;

  function ensureContext() {
    if (!context && AudioContextCtor) {
      context = new AudioContextCtor();
    }

    return context;
  }

  function stopActiveSources() {
    if (!session) {
      return;
    }

    for (const trackState of session.trackStates.values()) {
      if (trackState.onEnded) {
        trackState.source.removeEventListener('ended', trackState.onEnded);
      }

      try {
        trackState.source.stop();
      } catch (error) {
        // Sources can already be finished when we stop or reset the session.
      }
    }

    session = null;
  }

  async function loadBuffer(track) {
    if (bufferCache.has(track.id)) {
      return bufferCache.get(track.id);
    }

    const response = await fetchImpl(track.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ensureContext().decodeAudioData(arrayBuffer);
    bufferCache.set(track.id, audioBuffer);
    return audioBuffer;
  }

  function createTrackState(trackId, buffer, startTime) {
    const trackEnabled = session.selectedTrackIds.has(trackId);
    const source = ensureContext().createBufferSource();
    const gainNode = ensureContext().createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(masterGainNode);
    gainNode.gain.setValueAtTime(trackEnabled ? 1 : 0, ensureContext().currentTime);
    source.start(startTime);

    const trackState = {
      ended: false,
      gainNode,
      id: trackId,
      onEnded: null,
      source
    };

    trackState.onEnded = () => {
      trackState.ended = true;
      maybeRepeat();
    };

    source.addEventListener('ended', trackState.onEnded);
    return trackState;
  }

  function startPlaybackCycle() {
    const startTime = ensureContext().currentTime + 0.25;
    session.trackStates = new Map();

    for (const trackId of session.loadedTrackIds) {
      const trackState = createTrackState(trackId, bufferCache.get(trackId), startTime);
      session.trackStates.set(trackId, trackState);
    }
  }

  function maybeRepeat() {
    if (!shouldRepeatPlayback(session)) {
      return;
    }

    const previousSession = cloneSessionForRestart(session);
    stopActiveSources();
    if (!masterGainNode) {
      return;
    }

    session = previousSession;
    startPlaybackCycle();
  }

  function syncSelection(selectedTrackIds = []) {
    if (!session) {
      return;
    }

    session.selectedTrackIds = new Set(normalizeSelectedTrackIds(selectedTrackIds, availableTrackMap));

    if (!session.isRealtimeEnabled) {
      return;
    }

    for (const trackId of session.loadedTrackIds) {
      const trackState = session.trackStates.get(trackId);
      if (!trackState) {
        continue;
      }

      trackState.gainNode.gain.setValueAtTime(session.selectedTrackIds.has(trackId) ? 1 : 0, ensureContext().currentTime);
    }
  }

  return {
    async play({ isRealtimeEnabled, isRepeatEnabled, selectedTrackIds, volume }) {
      currentVolume = volume;

      const validSelectedTrackIds = normalizeSelectedTrackIds(selectedTrackIds, availableTrackMap);
      const loadedTrackIds = getLoadedTrackIds({
        availableTracks,
        isRealtimeEnabled,
        selectedTrackIds: validSelectedTrackIds
      });

      stopActiveSources();

      if (loadedTrackIds.length === 0) {
        masterGainNode = null;
        return;
      }

      ensureContext();
      masterGainNode = ensureContext().createGain();
      masterGainNode.connect(ensureContext().destination);
      masterGainNode.gain.setValueAtTime(currentVolume, ensureContext().currentTime);

      await Promise.all(loadedTrackIds.map((trackId) => loadBuffer(availableTrackMap.get(trackId))));

      session = createPlaybackSession({
        isRealtimeEnabled,
        isRepeatEnabled,
        loadedTrackIds,
        selectedTrackIds: validSelectedTrackIds
      });

      startPlaybackCycle();
    },
    resetSession() {
      stopActiveSources();
      masterGainNode = null;
    },
    setRepeatEnabled(isRepeatEnabled) {
      if (session) {
        session.isRepeatEnabled = isRepeatEnabled;
      }
    },
    setVolume(volume) {
      currentVolume = volume;
      if (masterGainNode) {
        masterGainNode.gain.setValueAtTime(volume, ensureContext().currentTime);
      }
    },
    stop() {
      stopActiveSources();
      masterGainNode = null;
    },
    syncSelection
  };
}
