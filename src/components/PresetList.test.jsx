import { fireEvent, render, screen, within } from '@testing-library/react';
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

const TEST_PRESETS = [
  {
    id: 'drwyz',
    name: 'u/Drwyz',
    trackIds: ['edm_late_main', 'hyperpop_late_drums', 'illbeats_late', 'truedamage_late_secondary']
  },
  {
    id: 'dupes',
    name: 'Duplicate Check',
    trackIds: ['alpha', 'alpha', 'beta']
  }
];

function renderPresetList(store) {
  return render(
    <MixerStoreProvider store={store}>
      <PresetList presets={TEST_PRESETS} />
    </MixerStoreProvider>
  );
}

describe('PresetList', () => {
  it('keeps each preset button accessible name equal to the preset name only', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    renderPresetList(store);

    expect(screen.getByRole('button', { name: 'u/Drwyz' })).toBeInTheDocument();
    expect(screen.getByText('4 tracks')).toBeInTheDocument();
  });

  it('renders the shelf with list and listitem semantics', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    renderPresetList(store);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(TEST_PRESETS.length);
  });

  it('marks the matching preset as active when selection contains the same track multiset in any order', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    store.setState({
      selectedTrackIds: ['truedamage_late_secondary', 'illbeats_late', 'edm_late_main', 'hyperpop_late_drums']
    });

    renderPresetList(store);

    expect(screen.getByRole('button', { name: 'u/Drwyz' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not mark a preset active when duplicate track counts do not match', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    store.setState({
      selectedTrackIds: ['alpha', 'beta', 'beta']
    });

    renderPresetList(store);

    expect(screen.getByRole('button', { name: 'Duplicate Check' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies a preset selection when a preset shelf item is pressed', () => {
    const store = createMixerStore({ player: createFakePlayer() });
    renderPresetList(store);
    fireEvent.click(screen.getByRole('button', { name: 'u/Drwyz' }));

    expect(store.getState().selectedTrackIds).toEqual([
      'edm_late_main',
      'hyperpop_late_drums',
      'illbeats_late',
      'truedamage_late_secondary'
    ]);
  });
});
