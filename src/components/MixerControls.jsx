import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useMixerStore } from '../store/MixerStoreContext.jsx';

export default function MixerControls() {
  const clearSelection = useMixerStore((state) => state.clearSelection);
  const copyNoticeVisible = useMixerStore((state) => state.copyNoticeVisible);
  const copyShareLink = useMixerStore((state) => state.copyShareLink);
  const globalVolume = useMixerStore((state) => state.globalVolume);
  const isLoading = useMixerStore((state) => state.isLoading);
  const isRealtimeEnabled = useMixerStore((state) => state.isRealtimeEnabled);
  const isRepeatEnabled = useMixerStore((state) => state.isRepeatEnabled);
  const playSelection = useMixerStore((state) => state.playSelection);
  const randomizeSelection = useMixerStore((state) => state.randomizeSelection);
  const setRealtimeEnabled = useMixerStore((state) => state.setRealtimeEnabled);
  const setRepeatEnabled = useMixerStore((state) => state.setRepeatEnabled);
  const setVolume = useMixerStore((state) => state.setVolume);
  const stopPlayback = useMixerStore((state) => state.stopPlayback);
  const openTweetComposer = useMixerStore((state) => state.openTweetComposer);

  return (
    <Card className="control-deck">
      <CardHeader>
        <CardTitle>Mixer Controls</CardTitle>
        <CardDescription>Dial in the session, then build a mix from presets or trait layers.</CardDescription>
      </CardHeader>
      <CardContent className="control-deck-content">
        <section className="deck-section">
          <div className="deck-section-heading">
            <h3>Playback</h3>
            <p>Start or stop the current mix instantly.</p>
          </div>
          <div className="deck-actions deck-actions-primary">
            <Button onClick={playSelection} type="button">
              Play Selected Tracks
            </Button>
            <Button onClick={stopPlayback} type="button" variant="secondary">
              Stop All Music
            </Button>
          </div>
          {isLoading ? (
            <div className="deck-status" role="status">
              Loading Tracks...
            </div>
          ) : null}
        </section>

        <section className="deck-section">
          <div className="deck-section-heading">
            <h3>Session</h3>
            <p>Adjust volume and live session behavior.</p>
          </div>
          <div className="deck-slider-block">
            <div className="deck-slider-label">
              <span>Global Volume</span>
              <span>{Math.round(globalVolume * 100)}%</span>
            </div>
            <Slider
              aria-label="Global Volume:"
              max={1}
              min={0}
              onValueChange={(values) => setVolume(values[0] ?? 0)}
              step={0.01}
              value={[globalVolume]}
            />
          </div>
          <div className="deck-toggle-stack">
            <label className="deck-toggle-row">
              <span>
                <strong>Realtime</strong>
                <small>Keep the session open while toggling tracks.</small>
              </span>
              <Switch
                aria-label="Real Time Add/Remove Tracks (longer load on play)"
                checked={isRealtimeEnabled}
                onCheckedChange={setRealtimeEnabled}
              />
            </label>
            <label className="deck-toggle-row">
              <span>
                <strong>Repeat</strong>
                <small>Loop the active loaded session.</small>
              </span>
              <Switch aria-label="Repeat" checked={isRepeatEnabled} onCheckedChange={setRepeatEnabled} />
            </label>
          </div>
        </section>

        <section className="deck-section">
          <div className="deck-section-heading">
            <h3>Utilities</h3>
            <p>Randomize, reset, and share the current mix.</p>
          </div>
          <div className="deck-actions deck-actions-utility">
            <Button onClick={() => randomizeSelection()} type="button" variant="outline">
              Random Select Tracks
            </Button>
            <Button onClick={() => randomizeSelection('early')} type="button" variant="outline">
              Random Select Early Tracks
            </Button>
            <Button onClick={() => randomizeSelection('late')} type="button" variant="outline">
              Random Select Late Tracks
            </Button>
            <Button onClick={clearSelection} type="button" variant="secondary">
              Clear All Selections
            </Button>
            <Button onClick={copyShareLink} type="button" variant="outline">
              Generate Shareable Link
            </Button>
            <Button onClick={openTweetComposer} type="button" variant="secondary">
              Tweet Mix
            </Button>
            </div>
          {copyNoticeVisible ? (
            <Alert className="deck-inline-alert">
              <AlertTitle>URL Copied to Clipboard</AlertTitle>
              <AlertDescription>Share the current selection or post it directly.</AlertDescription>
            </Alert>
          ) : null}
        </section>
      </CardContent>
    </Card>
  );
}
