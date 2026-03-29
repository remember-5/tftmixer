import { presets, traits } from './data/catalog.js';
import Credits from './components/Credits.jsx';
import MixerControls from './components/MixerControls.jsx';
import NoticeStack from './components/NoticeStack.jsx';
import PresetList from './components/PresetList.jsx';
import TraitGrid from './components/TraitGrid.jsx';
import { useMixerPlayback } from './hooks/useMixerPlayback.js';
import { useMixerSelection } from './hooks/useMixerSelection.js';
import { useShareActions } from './hooks/useShareActions.js';

export default function App({ player }) {
  const playback = useMixerPlayback({ player });
  const selection = useMixerSelection({
    isPlaying: playback.isPlaying,
    isRealtimeEnabled: playback.isRealtimeEnabled,
    onSyncSelection: playback.syncSelection
  });
  const share = useShareActions({ selectedTrackIds: selection.selectedTrackIds });

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
        copyNoticeVisible={share.copyNoticeVisible}
        globalVolume={playback.globalVolume}
        isLoading={playback.isLoading}
        isRealtimeEnabled={playback.isRealtimeEnabled}
        isRepeatEnabled={playback.isRepeatEnabled}
        onClear={selection.clearSelection}
        onCopyLink={share.copyShareLink}
        onPlay={() => playback.playSelection(selection.selectedTrackIds)}
        onRandomAll={() => selection.randomizeSelection()}
        onRandomEarly={() => selection.randomizeSelection('early')}
        onRandomLate={() => selection.randomizeSelection('late')}
        onRealtimeToggle={playback.setRealtimeEnabled}
        onRepeatToggle={playback.setRepeatEnabled}
        onStop={playback.stopPlayback}
        onTweet={share.openTweetComposer}
        onVolumeChange={playback.setVolume}
      />
      <hr />
      <div className="layout">
        <div className="main-content">
          <TraitGrid onToggleTrack={selection.toggleTrack} selectedTrackIds={selection.selectedTrackIds} traits={traits} />
        </div>
        <PresetList onApplyPreset={selection.applySelection} presets={presets} />
      </div>
      <Credits />
    </div>
  );
}
