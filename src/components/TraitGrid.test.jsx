import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TraitGrid from './TraitGrid.jsx';

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
  it('renders checked state through the selection model', () => {
    render(
      <TraitGrid
        selection={{
          isTrackSelected: (trackId) => trackId === 'kda_late_main',
          toggleTrack: vi.fn()
        }}
        traits={traits}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'KDA late_main' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'KDA early_main' })).not.toBeChecked();
  });

  it('routes track toggles through the selection model', () => {
    const toggleTrack = vi.fn();

    render(
      <TraitGrid
        selection={{
          isTrackSelected: () => false,
          toggleTrack
        }}
        traits={traits}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'KDA early_main' }));

    expect(toggleTrack).toHaveBeenCalledWith('kda_early_main');
  });
});
