import { createStore } from 'zustand/vanilla';
import { presets, trackIds, trackLookup, traits } from '../data/catalog';
import { createAudioMixerPlayer } from '../lib/audioMixerPlayer';
import { buildShareUrl, buildTweetUrl, parseSelectedTracks } from '../lib/urlState';
import type { AudioMixerPlayer, Preset, RandomizeSelectionPhase, TrackLookup, Trait } from '@/types/mixer';
import type { StoreApi } from 'zustand/vanilla';

type NextSelectionUpdater = string[] | ((currentSelection: string[]) => string[]);

interface CreateMixerStoreOptions {
  allTrackIds?: string[];
  clearTimeout?: typeof clearTimeout;
  clipboard?: Pick<Clipboard, 'writeText'>;
  getBaseUrl?: () => string;
  lookup?: TrackLookup;
  openWindow?: typeof window.open;
  player?: AudioMixerPlayer;
  search?: string;
  setTimeout?: typeof setTimeout;
}

export interface MixerState {
  copyNoticeVisible: boolean;
  globalVolume: number;
  isLoading: boolean;
  isPlaying: boolean;
  isRealtimeEnabled: boolean;
  isRepeatEnabled: boolean;
  presets: Preset[];
  selectedTrackIds: string[];
  traits: Trait[];
  applySelection(nextSelection: string[]): void;
  copyShareLink(): Promise<void>;
  clearSelection(): void;
  dismissCopyNotice(): void;
  isTrackSelected(trackId: string): boolean;
  openTweetComposer(): void;
  playSelection(): Promise<void>;
  randomizeSelection(phase?: RandomizeSelectionPhase): void;
  setRealtimeEnabled(nextValue: boolean): void;
  setRepeatEnabled(nextValue: boolean): void;
  setVolume(volume: number): void;
  stopPlayback(): void;
  toggleTrack(trackId: string): void;
}

export type MixerStore = StoreApi<MixerState>;

function getDefaultSearch(): string {
  return window.location.search;
}

function getDefaultBaseUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function getDefaultClipboard(): Pick<Clipboard, 'writeText'> {
  return navigator.clipboard;
}

function getDefaultOpenWindow(): typeof window.open {
  return window.open.bind(window);
}

function restoreSelectedTracks(search: string, lookup: TrackLookup): string[] {
  return parseSelectedTracks(search).filter((trackId) => lookup[trackId]);
}

function pickRandomTracks(phase: RandomizeSelectionPhase | undefined, allTrackIds: string[], lookup: TrackLookup): string[] {
  const source = phase ? allTrackIds.filter((trackId) => lookup[trackId]?.phase === phase) : [...allTrackIds];
  const pool = [...source];
  const selectedTrackIds: string[] = [];

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
}: CreateMixerStoreOptions = {}): MixerStore {
  let copyNoticeTimeoutId: ReturnType<typeof setTimeout> | undefined;

  return createStore((set, get) => {
    function commitSelection(nextSelectionOrUpdater: NextSelectionUpdater) {
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
      applySelection(nextSelection: string[]) {
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
      isTrackSelected(trackId: string) {
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
        } catch (error: unknown) {
          console.error('Unable to play selected tracks.', error);
          set({ isPlaying: false });
        } finally {
          set({ isLoading: false });
        }
      },
      randomizeSelection(phase?: RandomizeSelectionPhase) {
        commitSelection(pickRandomTracks(phase, allTrackIds, lookup));
      },
      setRealtimeEnabled(nextValue: boolean) {
        player.resetSession();
        set({
          isLoading: false,
          isPlaying: false,
          isRealtimeEnabled: nextValue
        });
      },
      setRepeatEnabled(nextValue: boolean) {
        player.setRepeatEnabled(nextValue);
        set({ isRepeatEnabled: nextValue });
      },
      setVolume(volume: number) {
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
      toggleTrack(trackId: string) {
        commitSelection((currentSelection) =>
          currentSelection.includes(trackId)
            ? currentSelection.filter((currentTrackId) => currentTrackId !== trackId)
            : [...currentSelection, trackId]
        );
      }
    };
  });
}
