import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMixerPageModel } from './useMixerPageModel.js';

const playbackState = {
  globalVolume: 0.7,
  isLoading: true,
  isPlaying: true,
  isRealtimeEnabled: true,
  isRepeatEnabled: false,
  playSelection: vi.fn(),
  setRealtimeEnabled: vi.fn(),
  setRepeatEnabled: vi.fn(),
  setVolume: vi.fn(),
  stopPlayback: vi.fn(),
  syncSelection: vi.fn()
};

const selectionState = {
  applySelection: vi.fn(),
  clearSelection: vi.fn(),
  isTrackSelected: vi.fn(),
  randomizeSelection: vi.fn(),
  selectedTrackIds: ['kda_late_main'],
  toggleTrack: vi.fn()
};

const shareState = {
  copyNoticeVisible: true,
  copyShareLink: vi.fn(),
  openTweetComposer: vi.fn()
};

vi.mock('./useMixerPlayback.js', () => ({
  useMixerPlayback: vi.fn(() => playbackState)
}));

vi.mock('./useMixerSelection.js', () => ({
  useMixerSelection: vi.fn(() => selectionState)
}));

vi.mock('./useShareActions.js', () => ({
  useShareActions: vi.fn(() => shareState)
}));

describe('useMixerPageModel', () => {
  beforeEach(() => {
    playbackState.playSelection.mockClear();
    playbackState.setRealtimeEnabled.mockClear();
    playbackState.setRepeatEnabled.mockClear();
    playbackState.setVolume.mockClear();
    playbackState.stopPlayback.mockClear();
    playbackState.syncSelection.mockClear();
    selectionState.applySelection.mockClear();
    selectionState.clearSelection.mockClear();
    selectionState.randomizeSelection.mockClear();
    shareState.copyShareLink.mockClear();
    shareState.openTweetComposer.mockClear();
  });

  it('returns grouped controls state and actions while exposing the selection model', () => {
    const { result } = renderHook(() => useMixerPageModel({ player: { id: 'fake' } }));

    expect(result.current.controls.state).toEqual({
      copyNoticeVisible: true,
      globalVolume: 0.7,
      isLoading: true,
      isRealtimeEnabled: true,
      isRepeatEnabled: false
    });

    result.current.controls.actions.playSelection();
    result.current.controls.actions.randomizeEarly();
    result.current.controls.actions.randomizeLate();
    result.current.controls.actions.randomizeAll();
    result.current.controls.actions.clearSelection();
    result.current.controls.actions.copyShareLink();
    result.current.controls.actions.tweetMix();
    result.current.controls.actions.stopPlayback();
    result.current.controls.actions.setVolume(0.5);
    result.current.controls.actions.setRealtimeEnabled(false);
    result.current.controls.actions.setRepeatEnabled(true);
    result.current.selection.applySelection(['punk_late_main']);

    expect(playbackState.playSelection).toHaveBeenCalledWith(['kda_late_main']);
    expect(selectionState.randomizeSelection.mock.calls).toEqual([['early'], ['late'], []]);
    expect(selectionState.clearSelection).toHaveBeenCalled();
    expect(shareState.copyShareLink).toHaveBeenCalled();
    expect(shareState.openTweetComposer).toHaveBeenCalled();
    expect(playbackState.stopPlayback).toHaveBeenCalled();
    expect(playbackState.setVolume).toHaveBeenCalledWith(0.5);
    expect(playbackState.setRealtimeEnabled).toHaveBeenCalledWith(false);
    expect(playbackState.setRepeatEnabled).toHaveBeenCalledWith(true);
    expect(result.current.selection).toBe(selectionState);
    expect(result.current.traits.length).toBeGreaterThan(0);
    expect(result.current.presets.length).toBeGreaterThan(0);
  });
});
