import type { MixerState } from '@/store/createMixerStore';
import type { RandomizeSelectionPhase } from '@/types/mixer';

export interface MixerControlsViewModel {
  clearSelection: () => void;
  copyNoticeVisible: boolean;
  copyShareLink: () => Promise<void>;
  globalVolume: number;
  isLoading: boolean;
  isRealtimeEnabled: boolean;
  isRepeatEnabled: boolean;
  openTweetComposer: () => void;
  playSelection: () => Promise<void>;
  randomizeSelection: (phase?: RandomizeSelectionPhase) => void;
  setRealtimeEnabled: (nextValue: boolean) => void;
  setRepeatEnabled: (nextValue: boolean) => void;
  setVolume: (volume: number) => void;
  stopPlayback: () => void;
}

export function selectMixerControlsViewModel(state: MixerState): MixerControlsViewModel {
  return {
    clearSelection: state.clearSelection,
    copyNoticeVisible: state.copyNoticeVisible,
    copyShareLink: state.copyShareLink,
    globalVolume: state.globalVolume,
    isLoading: state.isLoading,
    isRealtimeEnabled: state.isRealtimeEnabled,
    isRepeatEnabled: state.isRepeatEnabled,
    openTweetComposer: state.openTweetComposer,
    playSelection: state.playSelection,
    randomizeSelection: state.randomizeSelection,
    setRealtimeEnabled: state.setRealtimeEnabled,
    setRepeatEnabled: state.setRepeatEnabled,
    setVolume: state.setVolume,
    stopPlayback: state.stopPlayback
  };
}
