import { createStore } from 'zustand/vanilla';
import { presets, trackIds, trackLookup, traits } from '../data/catalog.js';
import { createAudioMixerPlayer } from '../lib/audioMixerPlayer.js';
import { buildShareUrl, buildTweetUrl, parseSelectedTracks } from '../lib/urlState.js';

function getDefaultSearch() {
  return window.location.search;
}

function getDefaultBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function getDefaultClipboard() {
  return navigator.clipboard;
}

function getDefaultOpenWindow() {
  return window.open.bind(window);
}

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

export function createMixerStore({
  allTrackIds = trackIds,
  clearTimeout: clearTimeoutImpl = window.clearTimeout.bind(window),
  clipboard = getDefaultClipboard(),
  getBaseUrl = getDefaultBaseUrl,
  lookup = trackLookup,
  openWindow = getDefaultOpenWindow(),
  player = createAudioMixerPlayer(),
  search = getDefaultSearch(),
  setTimeout: setTimeoutImpl = window.setTimeout.bind(window)
} = {}) {
  let copyNoticeTimeoutId;

  return createStore((set, get) => {
    function commitSelection(nextSelectionOrUpdater) {
      set((state) => {
        const nextSelection =
          typeof nextSelectionOrUpdater === 'function'
            ? nextSelectionOrUpdater(state.selectedTrackIds)
            : nextSelectionOrUpdater;

        if (state.isRealtimeEnabled && state.isPlaying) {
          player.syncSelection(nextSelection);
        }

        return {
          selectedTrackIds: nextSelection
        };
      });
    }

    return {
      copyNoticeVisible: false,
      globalVolume: 1,
      isLoading: false,
      isPlaying: false,
      isRealtimeEnabled: false,
      isRepeatEnabled: false,
      presets,
      selectedTrackIds: restoreSelectedTracks(search, lookup),
      traits,
      applySelection(nextSelection) {
        commitSelection(nextSelection);
      },
      async copyShareLink() {
        const shareUrl = buildShareUrl(getBaseUrl(), get().selectedTrackIds);
        await clipboard.writeText(shareUrl);

        clearTimeoutImpl(copyNoticeTimeoutId);
        set({ copyNoticeVisible: true });
        copyNoticeTimeoutId = setTimeoutImpl(() => set({ copyNoticeVisible: false }), 2000);
      },
      clearSelection() {
        commitSelection([]);
      },
      dismissCopyNotice() {
        clearTimeoutImpl(copyNoticeTimeoutId);
        copyNoticeTimeoutId = undefined;
        set({ copyNoticeVisible: false });
      },
      isTrackSelected(trackId) {
        return get().selectedTrackIds.includes(trackId);
      },
      openTweetComposer() {
        const tweetWindow = openWindow(buildTweetUrl(getBaseUrl(), get().selectedTrackIds), '_blank');
        tweetWindow?.focus?.();
      },
      async playSelection() {
        const { globalVolume, isRealtimeEnabled, isRepeatEnabled, selectedTrackIds } = get();
        set({ isLoading: true });

        try {
          await player.play({
            isRealtimeEnabled,
            isRepeatEnabled,
            selectedTrackIds,
            volume: globalVolume
          });

          set({
            isPlaying: isRealtimeEnabled || selectedTrackIds.length > 0
          });
        } catch (error) {
          console.error('Unable to play selected tracks.', error);
          set({ isPlaying: false });
        } finally {
          set({ isLoading: false });
        }
      },
      randomizeSelection(phase) {
        commitSelection(pickRandomTracks(phase, allTrackIds, lookup));
      },
      setRealtimeEnabled(nextValue) {
        player.resetSession();
        set({
          isLoading: false,
          isPlaying: false,
          isRealtimeEnabled: nextValue
        });
      },
      setRepeatEnabled(nextValue) {
        player.setRepeatEnabled(nextValue);
        set({ isRepeatEnabled: nextValue });
      },
      setVolume(volume) {
        player.setVolume(volume);
        set({ globalVolume: volume });
      },
      stopPlayback() {
        player.stop();
        set({
          isLoading: false,
          isPlaying: false
        });
      },
      toggleTrack(trackId) {
        commitSelection((currentSelection) =>
          currentSelection.includes(trackId)
            ? currentSelection.filter((currentTrackId) => currentTrackId !== trackId)
            : [...currentSelection, trackId]
        );
      }
    };
  });
}
