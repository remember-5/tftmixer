import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PresetList from './PresetList.jsx';
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

describe('PresetList', () => {
  it('marks the matching preset as active when the selection matches it exactly', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    store.setState({
      selectedTrackIds: ['edm_late_main', 'hyperpop_late_drums', 'illbeats_late', 'truedamage_late_secondary']
    });

    render(
      <MixerStoreProvider store={store}>
        <PresetList presets={store.getState().presets} />
      </MixerStoreProvider>
    );

    expect(screen.getByRole('button', { name: /u\/Drwyz/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies a preset selection when a preset shelf item is pressed', () => {
    const store = createMixerStore({ player: createFakePlayer() });

    render(
      <MixerStoreProvider store={store}>
        <PresetList presets={store.getState().presets} />
      </MixerStoreProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /u\/Drwyz/i }));

    expect(store.getState().selectedTrackIds).toEqual([
      'edm_late_main',
      'hyperpop_late_drums',
      'illbeats_late',
      'truedamage_late_secondary'
    ]);
  });
});
