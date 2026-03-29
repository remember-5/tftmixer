import { presets, traits } from '../data/catalog.js';
import { useMixerPlayback } from './useMixerPlayback.js';
import { useMixerSelection } from './useMixerSelection.js';
import { useShareActions } from './useShareActions.js';

export function useMixerPageModel({ player }) {
  const playback = useMixerPlayback({ player });
  const selection = useMixerSelection({
    isPlaying: playback.isPlaying,
    isRealtimeEnabled: playback.isRealtimeEnabled,
    onSyncSelection: playback.syncSelection
  });
  const share = useShareActions({ selectedTrackIds: selection.selectedTrackIds });

  return {
    controls: {
      actions: {
        clearSelection: selection.clearSelection,
        copyShareLink: share.copyShareLink,
        playSelection: () => playback.playSelection(selection.selectedTrackIds),
        randomizeAll: () => selection.randomizeSelection(),
        randomizeEarly: () => selection.randomizeSelection('early'),
        randomizeLate: () => selection.randomizeSelection('late'),
        setRealtimeEnabled: playback.setRealtimeEnabled,
        setRepeatEnabled: playback.setRepeatEnabled,
        setVolume: playback.setVolume,
        stopPlayback: playback.stopPlayback,
        tweetMix: share.openTweetComposer
      },
      state: {
        copyNoticeVisible: share.copyNoticeVisible,
        globalVolume: playback.globalVolume,
        isLoading: playback.isLoading,
        isRealtimeEnabled: playback.isRealtimeEnabled,
        isRepeatEnabled: playback.isRepeatEnabled
      }
    },
    presets,
    selection,
    traits
  };
}
