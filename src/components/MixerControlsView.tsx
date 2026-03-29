import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { MixerControlsViewModel } from './mixerControls.selectors';

function ToggleChip({
  ariaLabel,
  checked,
  label,
  onCheckedChange
}: {
  ariaLabel: string;
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="operations-toggle-chip">
      <span className="operations-chip-label">{label}</span>
      <Switch aria-label={ariaLabel} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function MixerControlsView({
  clearSelection,
  copyNoticeVisible,
  copyShareLink,
  globalVolume,
  isLoading,
  isRealtimeEnabled,
  isRepeatEnabled,
  openTweetComposer,
  playSelection,
  randomizeSelection,
  setRealtimeEnabled,
  setRepeatEnabled,
  setVolume,
  stopPlayback
}: MixerControlsViewModel) {
  return (
    <Card className="operations-bar">
      <CardContent className="operations-bar-content">
        <div className="operations-main-row">
          <div className="operations-button-row">
            <Button className="operations-primary-button" onClick={playSelection} size="sm" type="button">
              Play Selected Tracks
            </Button>
            <Button className="operations-secondary-button" onClick={stopPlayback} size="sm" type="button" variant="secondary">
              Stop All Music
            </Button>
          </div>

          <div className="operations-session-row">
            <div className="operations-volume">
              <span className="operations-chip-label">Global Volume:</span>
              <Slider
                aria-label="Global Volume:"
                className="operations-volume-slider"
                max={1}
                min={0}
                onValueChange={(values: number[]) => setVolume(values[0] ?? 0)}
                step={0.01}
                value={[globalVolume]}
              />
              <span className="operations-volume-value">{Math.round(globalVolume * 100)}%</span>
            </div>

            <ToggleChip
              ariaLabel="Real Time Add/Remove Tracks (longer load on play)"
              checked={isRealtimeEnabled}
              label="Real Time"
              onCheckedChange={setRealtimeEnabled}
            />
            <ToggleChip ariaLabel="Repeat" checked={isRepeatEnabled} label="Repeat" onCheckedChange={setRepeatEnabled} />
          </div>
        </div>

        <div className="operations-utility-row">
          <Button className="operations-utility-button" onClick={() => randomizeSelection()} size="sm" type="button" variant="outline">
            Random All
          </Button>
          <Button className="operations-utility-button" onClick={() => randomizeSelection('early')} size="sm" type="button" variant="outline">
            Random Early
          </Button>
          <Button className="operations-utility-button" onClick={() => randomizeSelection('late')} size="sm" type="button" variant="outline">
            Random Late
          </Button>
          <Button className="operations-utility-button" onClick={clearSelection} size="sm" type="button" variant="secondary">
            Clear
          </Button>
          <Button className="operations-utility-button" onClick={copyShareLink} size="sm" type="button" variant="outline">
            Generate Shareable Link
          </Button>
          <Button className="operations-utility-button" onClick={openTweetComposer} size="sm" type="button" variant="secondary">
            Tweet Mix
          </Button>
        </div>

        {isLoading || copyNoticeVisible ? (
          <div className="operations-alert-row">
            {isLoading ? (
              <Alert className="operations-inline-alert" role="status">
                <AlertTitle>Loading</AlertTitle>
                <AlertDescription>Loading tracks...</AlertDescription>
              </Alert>
            ) : null}
            {copyNoticeVisible ? (
              <Alert className="operations-inline-alert">
                <AlertTitle>Copied</AlertTitle>
                <AlertDescription>Share link copied.</AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
