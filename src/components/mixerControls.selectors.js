export function selectMixerControlsViewModel(state) {
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
