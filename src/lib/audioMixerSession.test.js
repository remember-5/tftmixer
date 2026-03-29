import { describe, expect, it } from 'vitest';
import {
  cloneSessionForRestart,
  createPlaybackSession,
  getLoadedTrackIds,
  normalizeSelectedTrackIds,
  shouldRepeatPlayback
} from './audioMixerSession.js';

describe('audioMixerSession', () => {
  it('normalizes selected track ids against the available track set', () => {
    const availableTrackMap = new Map([
      ['kda_late_main', { id: 'kda_late_main' }],
      ['punk_late_main', { id: 'punk_late_main' }]
    ]);

    expect(normalizeSelectedTrackIds(['kda_late_main', 'missing', 'punk_late_main'], availableTrackMap)).toEqual([
      'kda_late_main',
      'punk_late_main'
    ]);
  });

  it('derives loaded track ids from playback mode', () => {
    const availableTracks = [{ id: 'kda_late_main' }, { id: 'punk_late_main' }];

    expect(getLoadedTrackIds({ availableTracks, isRealtimeEnabled: true, selectedTrackIds: ['kda_late_main'] })).toEqual([
      'kda_late_main',
      'punk_late_main'
    ]);
    expect(getLoadedTrackIds({ availableTracks, isRealtimeEnabled: false, selectedTrackIds: ['kda_late_main'] })).toEqual([
      'kda_late_main'
    ]);
  });

  it('requires all selected loaded tracks to end before repeating', () => {
    const session = createPlaybackSession({
      isRealtimeEnabled: true,
      isRepeatEnabled: true,
      loadedTrackIds: ['kda_late_main', 'punk_late_main'],
      selectedTrackIds: ['kda_late_main', 'punk_late_main']
    });

    session.trackStates.set('kda_late_main', { ended: true });
    session.trackStates.set('punk_late_main', { ended: false });

    expect(shouldRepeatPlayback(session)).toBe(false);

    session.trackStates.set('punk_late_main', { ended: true });

    expect(shouldRepeatPlayback(session)).toBe(true);
  });

  it('creates a fresh session shell when repeating', () => {
    const session = createPlaybackSession({
      isRealtimeEnabled: false,
      isRepeatEnabled: true,
      loadedTrackIds: ['kda_late_main'],
      selectedTrackIds: ['kda_late_main']
    });
    session.trackStates.set('kda_late_main', { ended: true });

    const restartedSession = cloneSessionForRestart(session);

    expect(restartedSession).not.toBe(session);
    expect(restartedSession.loadedTrackIds).toEqual(['kda_late_main']);
    expect([...restartedSession.selectedTrackIds]).toEqual(['kda_late_main']);
    expect(restartedSession.trackStates.size).toBe(0);
  });
});
