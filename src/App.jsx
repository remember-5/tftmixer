import { useEffect, useRef, useState } from 'react';
import { presets, trackIds, trackLookup, traits } from './data/catalog.js';
import { createAudioMixerPlayer } from './lib/audioMixerPlayer.js';
import { buildShareUrl, buildTweetUrl, parseSelectedTracks } from './lib/urlState.js';
import Credits from './components/Credits.jsx';
import MixerControls from './components/MixerControls.jsx';
import NoticeStack from './components/NoticeStack.jsx';
import PresetList from './components/PresetList.jsx';
import TraitGrid from './components/TraitGrid.jsx';

function getBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function pickRandomTracks(phase) {
  const source = phase ? trackIds.filter((trackId) => trackLookup[trackId]?.phase === phase) : [...trackIds];
  const pool = [...source];
  const selected = [];

  while (pool.length > 0 && selected.length < 5) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

export default function App({ player }) {
  const playerRef = useRef(player ?? createAudioMixerPlayer());
  const copyNoticeTimeoutRef = useRef();
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [globalVolume, setGlobalVolume] = useState(1);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copyNoticeVisible, setCopyNoticeVisible] = useState(false);

  useEffect(() => {
    const restoredTrackIds = parseSelectedTracks(window.location.search).filter((trackId) => trackLookup[trackId]);
    setSelectedTrackIds(restoredTrackIds);
  }, []);

  useEffect(() => () => clearTimeout(copyNoticeTimeoutRef.current), []);

  function updateSelection(nextSelectedTrackIds) {
    setSelectedTrackIds(nextSelectedTrackIds);

    if (isRealtimeEnabled && isPlaying) {
      playerRef.current.syncSelection(nextSelectedTrackIds);
    }
  }

  function toggleTrack(trackId) {
    const nextSelectedTrackIds = selectedTrackIds.includes(trackId)
      ? selectedTrackIds.filter((currentTrackId) => currentTrackId !== trackId)
      : [...selectedTrackIds, trackId];

    updateSelection(nextSelectedTrackIds);
  }

  async function handlePlay() {
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

  function handleStop() {
    playerRef.current.stop();
    setIsPlaying(false);
    setIsLoading(false);
  }

  function handleVolumeChange(volume) {
    setGlobalVolume(volume);
    playerRef.current.setVolume(volume);
  }

  function handleRealtimeToggle(nextValue) {
    setIsRealtimeEnabled(nextValue);
    playerRef.current.resetSession();
    setIsLoading(false);
    setIsPlaying(false);
  }

  function handleRepeatToggle(nextValue) {
    setIsRepeatEnabled(nextValue);
    playerRef.current.setRepeatEnabled(nextValue);
  }

  function showCopyNotice() {
    setCopyNoticeVisible(true);
    clearTimeout(copyNoticeTimeoutRef.current);
    copyNoticeTimeoutRef.current = setTimeout(() => setCopyNoticeVisible(false), 2000);
  }

  async function handleCopyLink() {
    const shareUrl = buildShareUrl(getBaseUrl(), selectedTrackIds);
    await navigator.clipboard.writeText(shareUrl);
    showCopyNotice();
  }

  function handleTweet() {
    const tweetWindow = window.open(buildTweetUrl(getBaseUrl(), selectedTrackIds), '_blank');
    tweetWindow?.focus();
  }

  return (
    <div className="app-shell">
      <a
        aria-label="Part of OfficiallySp - More projects"
        className="officiallysp-bar"
        href="https://officiallysp.net"
        style={{ '--os-accent': '#8b5cf6' }}
      >
        <span className="os-icon">◀</span>
        <span className="os-accent">OfficiallySp.net</span>
        <span>More projects</span>
      </a>
      <div className="background-image" />
      <div className="background-darken" />
      <h1>TFT Remix Rumble Music Mixer</h1>
      <h2>Select tracks to play. Layer multiple tracks together to create unique combinations.</h2>
      <NoticeStack />
      <MixerControls
        copyNoticeVisible={copyNoticeVisible}
        globalVolume={globalVolume}
        isLoading={isLoading}
        isRealtimeEnabled={isRealtimeEnabled}
        isRepeatEnabled={isRepeatEnabled}
        onClear={() => updateSelection([])}
        onCopyLink={handleCopyLink}
        onPlay={handlePlay}
        onRandomAll={() => updateSelection(pickRandomTracks())}
        onRandomEarly={() => updateSelection(pickRandomTracks('early'))}
        onRandomLate={() => updateSelection(pickRandomTracks('late'))}
        onRealtimeToggle={handleRealtimeToggle}
        onRepeatToggle={handleRepeatToggle}
        onStop={handleStop}
        onTweet={handleTweet}
        onVolumeChange={handleVolumeChange}
      />
      <hr />
      <div className="layout">
        <div className="main-content">
          <TraitGrid onToggleTrack={toggleTrack} selectedTrackIds={selectedTrackIds} traits={traits} />
        </div>
        <PresetList onApplyPreset={updateSelection} presets={presets} />
      </div>
      <Credits />
    </div>
  );
}
