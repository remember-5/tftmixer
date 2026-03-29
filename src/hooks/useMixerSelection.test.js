import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMixerSelection } from './useMixerSelection.js';

describe('useMixerSelection', () => {
  it('restores valid selected tracks from the URL and toggles membership', () => {
    const syncSelection = vi.fn();

    const { result } = renderHook(() =>
      useMixerSelection({
        isPlaying: false,
        isRealtimeEnabled: false,
        onSyncSelection: syncSelection,
        search: '?selectedTracks=kda_late_main,missing_track.,punk_late_main'
      })
    );

    expect(result.current.selectedTrackIds).toEqual(['kda_late_main', 'punk_late_main']);

    act(() => {
      result.current.toggleTrack('punk_late_main');
    });

    expect(result.current.selectedTrackIds).toEqual(['kda_late_main']);
    expect(syncSelection).not.toHaveBeenCalled();
  });

  it('syncs the next selection immediately when realtime playback is active', () => {
    const syncSelection = vi.fn();

    const { result } = renderHook(() =>
      useMixerSelection({
        isPlaying: true,
        isRealtimeEnabled: true,
        onSyncSelection: syncSelection,
        search: ''
      })
    );

    act(() => {
      result.current.applySelection(['edm_late_main', 'hyperpop_late_drums']);
    });

    expect(result.current.selectedTrackIds).toEqual(['edm_late_main', 'hyperpop_late_drums']);
    expect(syncSelection).toHaveBeenCalledWith(['edm_late_main', 'hyperpop_late_drums']);
  });
});
