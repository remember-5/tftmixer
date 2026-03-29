import { trackLookup } from '../data/catalog';
import type { AudioMixerPlayer, PlaybackOptions, Track } from '@/types/mixer';
import {
  cloneSessionForRestart,
  createPlaybackSession,
  getLoadedTrackIds,
  normalizeSelectedTrackIds,
  shouldRepeatPlayback
} from './audioMixerSession';
import type { PlaybackSession } from './audioMixerSession';

type AudioBufferLike = AudioBuffer;

type AudioSourceNodeLike = {
  addEventListener(type: 'ended', listener: () => void): void;
  buffer: AudioBufferLike | null;
  connect(destination: unknown): void;
  removeEventListener(type: 'ended', listener: () => void): void;
  start(when?: number): void;
  stop(when?: number): void;
};

type AudioGainNodeLike = {
  connect(destination: unknown): void;
  gain: {
    setValueAtTime(value: number, startTime: number): void;
  };
};

type AudioContextLike = {
  currentTime: number;
  createBufferSource(): AudioSourceNodeLike;
  createGain(): AudioGainNodeLike;
  decodeAudioData(audioData: ArrayBuffer): Promise<AudioBufferLike>;
  destination: unknown;
};

type AudioContextCtor = new () => AudioContextLike;

type FetchBufferResponse = {
  arrayBuffer(): Promise<ArrayBuffer>;
};

type FetchBuffer = (input: string) => Promise<FetchBufferResponse>;

interface AudioTrackState {
  ended: boolean;
  gainNode: AudioGainNodeLike;
  id: string;
  onEnded: (() => void) | null;
  source: AudioSourceNodeLike;
}

interface CreateAudioMixerPlayerOptions {
  AudioContextCtor?: AudioContextCtor | null;
  availableTracks?: Track[];
  fetchImpl?: FetchBuffer;
}

function getDefaultAudioContextCtor(): AudioContextCtor | null {
  const windowWithWebkitAudio = window as typeof window & {
    webkitAudioContext?: AudioContextCtor;
  };

  return window.AudioContext ?? windowWithWebkitAudio.webkitAudioContext ?? null;
}

function getDefaultFetch(): FetchBuffer {
  return window.fetch.bind(window) as FetchBuffer;
}

export function createAudioMixerPlayer({
  AudioContextCtor = getDefaultAudioContextCtor(),
  availableTracks = Object.values(trackLookup),
  fetchImpl = getDefaultFetch()
}: CreateAudioMixerPlayerOptions = {}): AudioMixerPlayer {
  const availableTrackMap = new Map(availableTracks.map((track) => [track.id, track]));
  const bufferCache = new Map<string, AudioBufferLike>();

  let context: AudioContextLike | null = null;
  let masterGainNode: AudioGainNodeLike | null = null;
  let session: PlaybackSession<AudioTrackState> | null = null;
  let currentVolume = 1;

  function ensureContext(): AudioContextLike {
    if (!context) {
      if (!AudioContextCtor) {
        throw new Error('AudioContext is unavailable.');
      }

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
      } catch {
        // Sources can already be finished when we stop or reset the session.
      }
    }

    session = null;
  }

  async function loadBuffer(track: Track): Promise<AudioBufferLike> {
    const cachedBuffer = bufferCache.get(track.id);

    if (cachedBuffer) {
      return cachedBuffer;
    }

    const response = await fetchImpl(track.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ensureContext().decodeAudioData(arrayBuffer);
    bufferCache.set(track.id, audioBuffer);
    return audioBuffer;
  }

  function createTrackState(trackId: string, buffer: AudioBufferLike, startTime: number): AudioTrackState {
    if (!session || !masterGainNode) {
      throw new Error('Playback session is not ready.');
    }

    const trackEnabled = session.selectedTrackIds.has(trackId);
    const source = ensureContext().createBufferSource();
    const gainNode = ensureContext().createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(masterGainNode);
    gainNode.gain.setValueAtTime(trackEnabled ? 1 : 0, ensureContext().currentTime);
    source.start(startTime);

    const trackState: AudioTrackState = {
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

  function startPlaybackCycle(): void {
    if (!session) {
      return;
    }

    const activeSession = session;
    const startTime = ensureContext().currentTime + 0.25;
    activeSession.trackStates = new Map();

    for (const trackId of activeSession.loadedTrackIds) {
      const buffer = bufferCache.get(trackId);
      if (!buffer) {
        throw new Error(`Missing audio buffer for track "${trackId}".`);
      }

      const trackState = createTrackState(trackId, buffer, startTime);
      activeSession.trackStates.set(trackId, trackState);
    }
  }

  function maybeRepeat(): void {
    const activeSession = session;

    if (!activeSession || !shouldRepeatPlayback(activeSession)) {
      return;
    }

    const previousSession = cloneSessionForRestart(activeSession);
    stopActiveSources();
    if (!masterGainNode) {
      return;
    }

    session = previousSession;
    startPlaybackCycle();
  }

  function syncSelection(selectedTrackIds: string[] = []): void {
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
    async play({ isRealtimeEnabled, isRepeatEnabled, selectedTrackIds, volume }: PlaybackOptions) {
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

      await Promise.all(loadedTrackIds.map((trackId) => loadBuffer(availableTrackMap.get(trackId)!)));

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
    setRepeatEnabled(isRepeatEnabled: boolean) {
      if (session) {
        session.isRepeatEnabled = isRepeatEnabled;
      }
    },
    setVolume(volume: number) {
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
