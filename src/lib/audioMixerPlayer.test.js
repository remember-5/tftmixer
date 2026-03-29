import { describe, expect, it, vi } from 'vitest';
import { createAudioMixerPlayer } from './audioMixerPlayer.js';

function createHarness() {
  let masterGainNode = null;
  const trackGainNodes = [];
  const sources = [];

  const audioContext = {
    currentTime: 10,
    decodeAudioData: vi.fn().mockImplementation(async (buffer) => ({ decodedFrom: buffer })),
    destination: { id: 'destination' },
    createBufferSource: vi.fn().mockImplementation(() => {
      const source = {
        addEventListener: vi.fn(),
        buffer: null,
        connect: vi.fn(),
        removeEventListener: vi.fn(),
        start: vi.fn(),
        stop: vi.fn()
      };
      sources.push(source);
      return source;
    }),
    createGain: vi.fn().mockImplementation(() => {
      const gainNode = {
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn()
        }
      };

      if (!masterGainNode) {
        masterGainNode = gainNode;
      } else {
        trackGainNodes.push(gainNode);
      }

      return gainNode;
    })
  };

  const fetchImpl = vi.fn().mockResolvedValue({
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8))
  });

  const availableTracks = [
    { id: 'kda_late_main', src: '/tracks/kda_late_main.aac' },
    { id: 'punk_late_main', src: '/tracks/punk_late_main.aac' }
  ];

  return {
    audioContext,
    availableTracks,
    fetchImpl,
    masterGainNode: () => masterGainNode,
    sources,
    trackGainNodes
  };
}

describe('audioMixerPlayer', () => {
  it('loads only the selected tracks when realtime mode is off', async () => {
    const harness = createHarness();
    const player = createAudioMixerPlayer({
      AudioContextCtor: function AudioContextCtor() {
        return harness.audioContext;
      },
      availableTracks: harness.availableTracks,
      fetchImpl: harness.fetchImpl
    });

    await player.play({
      isRealtimeEnabled: false,
      isRepeatEnabled: false,
      selectedTrackIds: ['kda_late_main'],
      volume: 0.5
    });

    expect(harness.fetchImpl).toHaveBeenCalledTimes(1);
    expect(harness.fetchImpl).toHaveBeenCalledWith('/tracks/kda_late_main.aac');
    expect(harness.masterGainNode().gain.setValueAtTime).toHaveBeenCalledWith(0.5, 10);
    expect(harness.sources[0].start).toHaveBeenCalledWith(10.25);
  });

  it('preloads all tracks in realtime mode and updates gain when the selection changes', async () => {
    const harness = createHarness();
    const player = createAudioMixerPlayer({
      AudioContextCtor: function AudioContextCtor() {
        return harness.audioContext;
      },
      availableTracks: harness.availableTracks,
      fetchImpl: harness.fetchImpl
    });

    await player.play({
      isRealtimeEnabled: true,
      isRepeatEnabled: false,
      selectedTrackIds: ['kda_late_main'],
      volume: 1
    });

    player.syncSelection(['punk_late_main']);

    expect(harness.fetchImpl).toHaveBeenCalledTimes(2);
    expect(harness.trackGainNodes[0].gain.setValueAtTime).toHaveBeenLastCalledWith(0, 10);
    expect(harness.trackGainNodes[1].gain.setValueAtTime).toHaveBeenLastCalledWith(1, 10);
  });

  it('reuses cached buffers across play calls', async () => {
    const harness = createHarness();
    const player = createAudioMixerPlayer({
      AudioContextCtor: function AudioContextCtor() {
        return harness.audioContext;
      },
      availableTracks: harness.availableTracks,
      fetchImpl: harness.fetchImpl
    });

    await player.play({
      isRealtimeEnabled: false,
      isRepeatEnabled: false,
      selectedTrackIds: ['kda_late_main'],
      volume: 1
    });
    player.stop();
    await player.play({
      isRealtimeEnabled: false,
      isRepeatEnabled: false,
      selectedTrackIds: ['kda_late_main'],
      volume: 1
    });

    expect(harness.fetchImpl).toHaveBeenCalledTimes(1);
  });
});
