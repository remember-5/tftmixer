export default function MixerControls({
  copyNoticeVisible,
  globalVolume,
  isLoading,
  isRealtimeEnabled,
  isRepeatEnabled,
  onClear,
  onCopyLink,
  onPlay,
  onRandomAll,
  onRandomEarly,
  onRandomLate,
  onRealtimeToggle,
  onRepeatToggle,
  onStop,
  onTweet,
  onVolumeChange
}) {
  return (
    <>
      <div>
        <label htmlFor="globalVolume">
          <strong>
            <h4>Global Volume:</h4>
          </strong>
        </label>
        <input
          id="globalVolume"
          max="1"
          min="0"
          name="volume"
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          step="0.01"
          type="range"
          value={globalVolume}
        />
      </div>
      <div className="toggle">
        <input checked={isRealtimeEnabled} id="realTime" onChange={(event) => onRealtimeToggle(event.target.checked)} type="checkbox" />
        <label htmlFor="realTime">Real Time Add/Remove Tracks (longer load on play)</label>
      </div>
      <div className="toggle">
        <input checked={isRepeatEnabled} id="repeat" onChange={(event) => onRepeatToggle(event.target.checked)} type="checkbox" />
        <label htmlFor="repeat">Repeat</label>
      </div>
      {isLoading ? (
        <div className="text-center" id="loadingIndicator" role="status">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Tracks...</span>
          </div>
        </div>
      ) : null}
      <div className="button-row">
        <button className="btn btn-success" onClick={onPlay} type="button">
          Play Selected Tracks
        </button>
        <button className="btn btn-secondary" onClick={onStop} type="button">
          Stop All Music
        </button>
        <button className="btn btn-warning" onClick={onRandomAll} type="button">
          Random Select Tracks
        </button>
        <button className="btn btn-warning" onClick={onRandomEarly} type="button">
          Random Select Early Tracks
        </button>
        <button className="btn btn-warning" onClick={onRandomLate} type="button">
          Random Select Late Tracks
        </button>
        <button className="btn btn-danger" onClick={onClear} type="button">
          Clear All Selections
        </button>
        <button className="btn btn-info" onClick={onCopyLink} type="button">
          Generate Shareable Link
        </button>
        <button className="btn btn-primary" onClick={onTweet} type="button">
          <i aria-hidden="true" className="fab fa-twitter" /> Tweet Mix
        </button>
      </div>
      {copyNoticeVisible ? (
        <div className="alert alert-success copy-notification" id="copyNotification" role="status">
          <strong>URL Copied to Clipboard</strong>
        </div>
      ) : null}
    </>
  );
}
