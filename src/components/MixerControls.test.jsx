import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MixerControls from './MixerControls.jsx';

function createProps() {
  return {
    actions: {
      clearSelection: vi.fn(),
      copyShareLink: vi.fn(),
      playSelection: vi.fn(),
      randomizeAll: vi.fn(),
      randomizeEarly: vi.fn(),
      randomizeLate: vi.fn(),
      setRealtimeEnabled: vi.fn(),
      setRepeatEnabled: vi.fn(),
      setVolume: vi.fn(),
      stopPlayback: vi.fn(),
      tweetMix: vi.fn()
    },
    state: {
      copyNoticeVisible: true,
      globalVolume: 0.5,
      isLoading: true,
      isRealtimeEnabled: true,
      isRepeatEnabled: false
    }
  };
}

describe('MixerControls', () => {
  it('renders from a single state object', () => {
    render(<MixerControls {...createProps()} />);

    expect(screen.getByRole('slider')).toHaveValue('0.5');
    expect(screen.getByRole('checkbox', { name: 'Real Time Add/Remove Tracks (longer load on play)' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Repeat' })).not.toBeChecked();
    expect(screen.getByText('URL Copied to Clipboard')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).not.toHaveLength(0);
  });

  it('routes user actions through the actions object', () => {
    const props = createProps();
    render(<MixerControls {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Play Selected Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop All Music' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Early Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Select Late Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear All Selections' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generate Shareable Link' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tweet Mix' }));
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.7' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Real Time Add/Remove Tracks (longer load on play)' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Repeat' }));

    expect(props.actions.playSelection).toHaveBeenCalled();
    expect(props.actions.stopPlayback).toHaveBeenCalled();
    expect(props.actions.randomizeAll).toHaveBeenCalled();
    expect(props.actions.randomizeEarly).toHaveBeenCalled();
    expect(props.actions.randomizeLate).toHaveBeenCalled();
    expect(props.actions.clearSelection).toHaveBeenCalled();
    expect(props.actions.copyShareLink).toHaveBeenCalled();
    expect(props.actions.tweetMix).toHaveBeenCalled();
    expect(props.actions.setVolume).toHaveBeenCalledWith(0.7);
    expect(props.actions.setRealtimeEnabled).toHaveBeenCalledWith(false);
    expect(props.actions.setRepeatEnabled).toHaveBeenCalledWith(true);
  });
});
