import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import type { AudioMixerPlayer } from '@/types/mixer';

function createFakePlayer(): AudioMixerPlayer {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    setRepeatEnabled: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
    syncSelection: vi.fn(),
    resetSession: vi.fn()
  };
}

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) }
    });
  });

  it('restores selected tracks from the selectedTracks query string', () => {
    const fakePlayer = createFakePlayer();
    window.history.pushState({}, '', '/?selectedTracks=kda_late_main,punk_late_main.');

    render(<App player={fakePlayer} />);

    expect(screen.getByRole('checkbox', { name: 'KDA late_main' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Punk late_main' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'KDA early_main' })).not.toBeChecked();
  });

  it('applies a preset and plays the selected tracks through the player interface', async () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    fireEvent.click(screen.getByRole('button', { name: 'u/Drwyz' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play Selected Tracks' }));

    await waitFor(() => {
      expect(fakePlayer.play).toHaveBeenCalledWith({
        isRealtimeEnabled: false,
        isRepeatEnabled: false,
        selectedTrackIds: ['edm_late_main', 'hyperpop_late_drums', 'illbeats_late', 'truedamage_late_secondary'],
        volume: 1
      });
    });
  });

  it('keeps realtime sessions interactive even when play starts with no selected tracks', async () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    fireEvent.click(screen.getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play Selected Tracks' }));

    await waitFor(() => {
      expect(fakePlayer.play).toHaveBeenCalledWith({
        isRealtimeEnabled: true,
        isRepeatEnabled: false,
        selectedTrackIds: [],
        volume: 1
      });
    });

    fireEvent.click(screen.getByRole('checkbox', { name: 'KDA late_main' }));

    expect(fakePlayer.syncSelection).toHaveBeenCalledWith(['kda_late_main']);
  });

  it('forwards repeat toggles to the player so active sessions can react immediately', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    fireEvent.click(screen.getByRole('switch', { name: 'Repeat' }));

    expect(fakePlayer.setRepeatEnabled).toHaveBeenCalledWith(true);
  });

  it('renders semantic separators between control deck sections', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    const commandDeck = screen.getByRole('complementary', { name: 'Mixer command deck' });

    expect(within(commandDeck).getAllByRole('separator')).toHaveLength(2);
  });

  it('does not render early or late phase badges inside the trait grid', () => {
    const fakePlayer = createFakePlayer();
    const { container } = render(<App player={fakePlayer} />);
    expect(container.querySelectorAll('.track-phase-badge')).toHaveLength(0);
  });
});
