import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useShareActions } from './useShareActions.js';

describe('useShareActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.pushState({}, '', '/');
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies the share URL and clears the copied notice after the timeout', async () => {
    const { result } = renderHook(() => useShareActions({ selectedTrackIds: ['kda_late_main'] }));

    await act(async () => {
      await result.current.copyShareLink();
    });

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/?selectedTracks=kda_late_main`);
    expect(result.current.copyNoticeVisible).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copyNoticeVisible).toBe(false);
  });
});
