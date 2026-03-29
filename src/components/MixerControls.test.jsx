import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MixerControls from './MixerControls.jsx';
import { MixerStoreProvider } from '../store/MixerStoreContext.jsx';
import { createMixerStore } from '../store/createMixerStore.js';

function createFakePlayer() {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    resetSession: vi.fn(),
    setRepeatEnabled: vi.fn(),
    setVolume: vi.fn(),
    stop: vi.fn(),
    syncSelection: vi.fn()
  };
}

function renderWithStore(store) {
  render(
    <MixerStoreProvider store={store}>
      <MixerControls />
    </MixerStoreProvider>
  );
}

describe('MixerControls', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) }
    });
  });

  it('renders from the mixer store state', () => {
    const store = createMixerStore({
      player: createFakePlayer()
    });

    store.setState({
      copyNoticeVisible: true,
      globalVolume: 0.5,
      isLoading: true,
      isRealtimeEnabled: true,
      isRepeatEnabled: false
    });

    renderWithStore(store);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0.5');
    expect(screen.getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Repeat' })).not.toBeChecked();
    expect(screen.getByText('URL Copied to Clipboard')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).not.toHaveLength(0);
  });

  it('routes user actions through the mixer store', async () => {
    const player = createFakePlayer();
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    const openWindow = vi.fn(() => ({ focus: vi.fn() }));
    const store = createMixerStore({
      clipboard,
      getBaseUrl: () => 'https://tftmixer.test/',
      openWindow,
      player
    });

    store.getState().applySelection(['kda_late_main']);

    renderWithStore(store);

    fireEvent.click(screen.getByRole('button', { name: 'Play Selected Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop All Music' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Early Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Late Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear All Selections' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generate Shareable Link' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tweet Mix' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Repeat' }));

    await waitFor(() => {
      expect(player.play).toHaveBeenCalled();
    });

    expect(player.stop).toHaveBeenCalled();
    expect(store.getState().selectedTrackIds).toEqual([]);
    expect(clipboard.writeText).toHaveBeenCalledWith('https://tftmixer.test/');
    expect(openWindow).toHaveBeenCalled();
    expect(player.resetSession).toHaveBeenCalled();
    expect(player.setRepeatEnabled).toHaveBeenCalledWith(true);
  });
});
