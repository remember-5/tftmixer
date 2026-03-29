import { useRef, useState } from 'react';
import { createAudioMixerPlayer } from '../lib/audioMixerPlayer.js';

export function useMixerPlayback({ player }) {
  const playerRef = useRef(null);

  if (playerRef.current === null) {
    playerRef.current = player ?? createAudioMixerPlayer();
  }

  const [globalVolume, setGlobalVolume] = useState(1);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playSelection(selectedTrackIds) {
    setIsLoading(true);

    try {
      await playerRef.current.play({
        isRealtimeEnabled,
        isRepeatEnabled,
        selectedTrackIds,
        volume: globalVolume
      });
      setIsPlaying(isRealtimeEnabled || selectedTrackIds.length > 0);
    } catch (error) {
      console.error('Unable to play selected tracks.', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }

  function stopPlayback() {
    playerRef.current.stop();
    setIsPlaying(false);
    setIsLoading(false);
  }

  function setVolume(volume) {
    setGlobalVolume(volume);
    playerRef.current.setVolume(volume);
  }

  function setRealtimeEnabled(nextValue) {
    setIsRealtimeEnabled(nextValue);
    playerRef.current.resetSession();
    setIsLoading(false);
    setIsPlaying(false);
  }

  function setRepeatEnabled(nextValue) {
    setIsRepeatEnabled(nextValue);
    playerRef.current.setRepeatEnabled(nextValue);
  }

  function syncSelection(selectedTrackIds) {
    playerRef.current.syncSelection(selectedTrackIds);
  }

  return {
    globalVolume,
    isLoading,
    isPlaying,
    isRealtimeEnabled,
    isRepeatEnabled,
    playSelection,
    setRealtimeEnabled,
    setRepeatEnabled,
    setVolume,
    stopPlayback,
    syncSelection
  };
}
