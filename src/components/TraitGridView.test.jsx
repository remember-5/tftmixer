import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TraitGridView from './TraitGridView.jsx';

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

describe('TraitGridView', () => {
  it('renders selected state from props and dispatches toggles without store context', () => {
    const onToggleTrack = vi.fn();

    render(
      <TraitGridView
        onToggleTrack={onToggleTrack}
        selectedTrackIdSet={new Set(['kda_late_main'])}
        traits={traits}
      />
    );

    expect(screen.getByTestId('trait-card-kda')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('track-row-kda_late_main')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('checkbox', { name: 'KDA late_main' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'KDA early_main' }));

    expect(onToggleTrack).toHaveBeenCalledWith('kda_early_main');
  });
});
