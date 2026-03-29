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

  it('renders a board-only layout without the top stage card or live hud', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    expect(screen.queryByRole('region', { name: 'Remix Rumble stage banner' })).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Control tower' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Mixer operations bar' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Community preset deck' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Sound blocks grid' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Tracks armed 0')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Remix Rumble Mixer' })).not.toBeInTheDocument();
  });

  it('lays out the main board as sound blocks and preset deck beneath the operations bar', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    const board = screen.getByRole('region', { name: 'Mixer board' });
    const orderedRegions = Array.from(board.children).map((element) => element.getAttribute('aria-label'));

    expect(orderedRegions).toEqual(['Sound blocks grid', 'Community preset deck']);
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

  it('keeps core interactions working without a visible live hud', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    fireEvent.click(screen.getByRole('button', { name: 'u/Drwyz' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Repeat' }));

    expect(screen.queryByLabelText('Tracks armed 4')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Live add on')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Loop on')).not.toBeInTheDocument();
  });

  it('renders community presets as a flat quick-pick list without featured nesting', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    fireEvent.click(screen.getByRole('button', { name: 'u/Drwyz' }));

    const presetList = screen.getByRole('list', { name: 'Community presets' });

    expect(screen.queryByRole('region', { name: 'Featured community preset' })).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Community preset queue' })).not.toBeInTheDocument();
    expect(within(presetList).getByRole('button', { name: 'u/Drwyz' })).toBeInTheDocument();
    expect(within(presetList).getAllByRole('button').length).toBeGreaterThan(3);
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

  it('renders playback controls inside the compact operations bar', () => {
    const fakePlayer = createFakePlayer();
    render(<App player={fakePlayer} />);

    const operationsBar = screen.getByRole('region', { name: 'Mixer operations bar' });

    expect(operationsBar).toHaveAttribute('data-density', 'compact');
    expect(within(operationsBar).getByRole('button', { name: 'Play Selected Tracks' })).toBeInTheDocument();
    expect(within(operationsBar).getByRole('button', { name: 'Stop All Music' })).toBeInTheDocument();
    expect(within(operationsBar).getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' })).toBeInTheDocument();
  });

  it('does not render early or late phase badges inside the trait grid', () => {
    const fakePlayer = createFakePlayer();
    const { container } = render(<App player={fakePlayer} />);
    expect(container.querySelectorAll('.track-phase-badge')).toHaveLength(0);
  });

  it('renders sound blocks in a dense board layout with a wide preset deck rail', () => {
    const fakePlayer = createFakePlayer();
    const { container } = render(<App player={fakePlayer} />);

    expect(screen.getByRole('region', { name: 'Community preset deck' })).toHaveAttribute('data-panel-width', 'wide');
    expect(container.querySelector('.trait-container[data-layout="compact-5-up"]')).not.toBeNull();
    expect(container.querySelector('.trait-container[data-card-width="fluid-5-up"]')).not.toBeNull();
    expect(container.querySelector('.trait-container[data-density="dense"]')).not.toBeNull();
    expect(container.querySelectorAll('.track-row-state')).toHaveLength(0);
  });
});
