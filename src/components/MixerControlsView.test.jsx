import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MixerControlsView from './MixerControlsView.jsx';

function createViewProps(overrides = {}) {
  return {
    clearSelection: vi.fn(),
    copyNoticeVisible: true,
    copyShareLink: vi.fn(),
    globalVolume: 0.5,
    isLoading: true,
    isRealtimeEnabled: true,
    isRepeatEnabled: false,
    openTweetComposer: vi.fn(),
    playSelection: vi.fn(),
    randomizeSelection: vi.fn(),
    setRealtimeEnabled: vi.fn(),
    setRepeatEnabled: vi.fn(),
    setVolume: vi.fn(),
    stopPlayback: vi.fn(),
    ...overrides
  };
}

describe('MixerControlsView', () => {
  it('renders from props and routes button interactions without store context', () => {
    const props = createViewProps();

    render(<MixerControlsView {...props} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Loading Tracks...')).toBeInTheDocument();
    expect(screen.getByText('URL Copied to Clipboard')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Play Selected Tracks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop All Music' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random All' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Early' }));
    fireEvent.click(screen.getByRole('button', { name: 'Random Late' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy Link' }));
    fireEvent.click(screen.getByRole('button', { name: 'Post to X' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Real Time Add/Remove Tracks (longer load on play)' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Repeat' }));

    expect(props.playSelection).toHaveBeenCalled();
    expect(props.stopPlayback).toHaveBeenCalled();
    expect(props.randomizeSelection).toHaveBeenNthCalledWith(1);
    expect(props.randomizeSelection).toHaveBeenNthCalledWith(2, 'early');
    expect(props.randomizeSelection).toHaveBeenNthCalledWith(3, 'late');
    expect(props.clearSelection).toHaveBeenCalled();
    expect(props.copyShareLink).toHaveBeenCalled();
    expect(props.openTweetComposer).toHaveBeenCalled();
    expect(props.setRealtimeEnabled).toHaveBeenCalledWith(false);
    expect(props.setRepeatEnabled).toHaveBeenCalledWith(true);
  });
});
