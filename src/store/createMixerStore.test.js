import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMixerStore } from './createMixerStore.js';

function createFakePlayer() {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    resetSession: vi.fn(),
    setRepeatEnabled: vi.fn(),
    setVolume: vi.fn(),
    stop: vi.fn(),
    syncSelection: vi.fn()
  };
}

describe('createMixerStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('restores valid selected tracks from the selectedTracks query string and toggles membership', () => {
    const store = createMixerStore({
      player: createFakePlayer(),
      search: '?selectedTracks=kda_late_main,missing_track.,punk_late_main'
    });

    expect(store.getState().selectedTrackIds).toEqual(['kda_late_main', 'punk_late_main']);

    store.getState().toggleTrack('punk_late_main');

    expect(store.getState().selectedTrackIds).toEqual(['kda_late_main']);
  });

  it('keeps realtime sessions interactive when playback starts without selected tracks', async () => {
    const player = createFakePlayer();
    const store = createMixerStore({
      player
    });

    store.getState().setRealtimeEnabled(true);

    await store.getState().playSelection();

    expect(player.play).toHaveBeenCalledWith({
      isRealtimeEnabled: true,
      isRepeatEnabled: false,
      selectedTrackIds: [],
      volume: 1
    });
    expect(store.getState().isPlaying).toBe(true);

    store.getState().toggleTrack('kda_late_main');

    expect(player.syncSelection).toHaveBeenCalledWith(['kda_late_main']);
  });

  it('copies a share link, shows a notification, and hides it after the timeout', async () => {
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    const store = createMixerStore({
      clipboard,
      getBaseUrl: () => 'https://tftmixer.test/',
      player: createFakePlayer(),
      clearTimeout,
      setTimeout
    });

    await store.getState().copyShareLink();

    expect(clipboard.writeText).toHaveBeenCalledWith('https://tftmixer.test/');
    expect(store.getState().copyNoticeVisible).toBe(true);

    vi.advanceTimersByTime(2000);

    expect(store.getState().copyNoticeVisible).toBe(false);
  });
});
