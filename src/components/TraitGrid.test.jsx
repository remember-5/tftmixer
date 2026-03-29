import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TraitGrid from './TraitGrid.jsx';
import { MixerStoreProvider } from '../store/MixerStoreContext.jsx';
import { createMixerStore } from '../store/createMixerStore.js';

const traits = [
  {
    id: 'kda',
    icon: '/icon/kda.png',
    name: 'KDA',
    tracks: [
      { id: 'kda_early_main', label: 'early_main', phase: 'early' },
      { id: 'kda_late_main', label: 'late_main', phase: 'late' }
    ]
  }
];

describe('TraitGrid', () => {
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

  it('renders checked state through the mixer store', () => {
    const store = createMixerStore({
      player: createFakePlayer()
    });
    store.setState({ selectedTrackIds: ['kda_late_main'] });

    render(
      <MixerStoreProvider store={store}>
        <TraitGrid traits={traits} />
      </MixerStoreProvider>
    );

    expect(screen.getByRole('checkbox', { name: 'KDA late_main' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'KDA early_main' })).not.toBeChecked();
  });

  it('routes track toggles through the mixer store', () => {
    const store = createMixerStore({
      player: createFakePlayer()
    });

    render(
      <MixerStoreProvider store={store}>
        <TraitGrid traits={traits} />
      </MixerStoreProvider>
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'KDA early_main' }));

    expect(store.getState().selectedTrackIds).toEqual(['kda_early_main']);
  });

  it('re-renders the checkbox state after a track is toggled', () => {
    const store = createMixerStore({
      player: createFakePlayer()
    });

    render(
      <MixerStoreProvider store={store}>
        <TraitGrid traits={traits} />
      </MixerStoreProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'KDA early_main' });

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});
