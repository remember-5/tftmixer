import { type ReactNode, useId } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { MixerControlsViewModel } from './mixerControls.selectors';

interface DeckSectionProps {
  children: ReactNode;
  description: string;
  title: string;
}

interface ToggleRowProps {
  checked: boolean;
  description: string;
  descriptionId: string;
  label: string;
  labelId: string;
  onCheckedChange: (checked: boolean) => void;
}

function DeckSection({ children, description, title }: DeckSectionProps) {
  return (
    <section className="deck-section">
      <div className="deck-section-heading">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({ checked, description, descriptionId, label, labelId, onCheckedChange }: ToggleRowProps) {
  return (
    <div className="deck-toggle-row">
      <span>
        <strong id={labelId}>{label}</strong>
        <small id={descriptionId}>{description}</small>
      </span>
      <Switch aria-describedby={descriptionId} aria-labelledby={labelId} checked={checked} onCheckedChange={onCheckedChange} />
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
  const realtimeLabelId = useId();
  const realtimeDescriptionId = useId();
  const repeatLabelId = useId();
  const repeatDescriptionId = useId();

  return (
    <Card className="control-deck">
      <CardHeader>
        <CardTitle>Mixer Controls</CardTitle>
        <CardDescription>Dial in the session, then build a mix from presets or trait layers.</CardDescription>
      </CardHeader>
      <CardContent className="control-deck-content">
        <DeckSection description="Start or stop the current mix instantly." title="Playback">
          <div className="deck-actions deck-actions-primary">
            <Button onClick={playSelection} type="button">
              Play Selected Tracks
            </Button>
            <Button onClick={stopPlayback} type="button" variant="secondary">
              Stop All Music
            </Button>
          </div>
          {isLoading ? (
            <Alert className="deck-status" role="status">
              <AlertDescription className="deck-status-description">Loading Tracks...</AlertDescription>
            </Alert>
          ) : null}
        </DeckSection>
        <Separator className="deck-divider" decorative={false} />

        <DeckSection description="Adjust volume and live session behavior." title="Session">
          <div className="deck-slider-block">
            <div className="deck-slider-label">
              <span>Global Volume</span>
              <span>{Math.round(globalVolume * 100)}%</span>
            </div>
            <Slider
              aria-label="Global Volume:"
              max={1}
              min={0}
              onValueChange={(values: number[]) => setVolume(values[0] ?? 0)}
              step={0.01}
              value={[globalVolume]}
            />
          </div>
          <div className="deck-toggle-stack">
            <ToggleRow
              checked={isRealtimeEnabled}
              description="Keep the session open while toggling tracks."
              descriptionId={realtimeDescriptionId}
              label="Real Time Add/Remove Tracks (longer load on play)"
              labelId={realtimeLabelId}
              onCheckedChange={setRealtimeEnabled}
            />
            <ToggleRow
              checked={isRepeatEnabled}
              description="Loop the active loaded session."
              descriptionId={repeatDescriptionId}
              label="Repeat"
              labelId={repeatLabelId}
              onCheckedChange={setRepeatEnabled}
            />
          </div>
        </DeckSection>
        <Separator className="deck-divider" decorative={false} />

        <DeckSection description="Randomize, reset, and share the current mix." title="Utilities">
          <div className="deck-actions deck-actions-utility">
            <Button onClick={() => randomizeSelection()} type="button" variant="outline">
              Random All
            </Button>
            <Button onClick={() => randomizeSelection('early')} type="button" variant="outline">
              Random Early
            </Button>
            <Button onClick={() => randomizeSelection('late')} type="button" variant="outline">
              Random Late
            </Button>
            <Button onClick={clearSelection} type="button" variant="secondary">
              Clear
            </Button>
            <Button onClick={copyShareLink} type="button" variant="outline">
              Copy Link
            </Button>
            <Button onClick={openTweetComposer} type="button" variant="secondary">
              Post to X
            </Button>
          </div>
          {copyNoticeVisible ? (
            <Alert className="deck-inline-alert">
              <AlertTitle>URL Copied to Clipboard</AlertTitle>
              <AlertDescription>Share the current selection or post it directly.</AlertDescription>
            </Alert>
          ) : null}
        </DeckSection>
      </CardContent>
    </Card>
  );
}
