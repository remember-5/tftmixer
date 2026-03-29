import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Copy, LoaderCircle, Music2, Pause, Repeat2, Shuffle, Volume2 } from 'lucide-react';
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
    <Card className="border-white/12 bg-black/35 text-white shadow-2xl backdrop-blur-xl">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl text-white">Mixer Controls</CardTitle>
        <CardDescription className="max-w-2xl text-zinc-300">
          Dial in the master volume, switch session behavior, then build a mix from the full catalog or a preset.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <Volume2 className="size-4 text-emerald-300" />
                <span>Global Volume:</span>
              </div>
              <span className="text-sm text-zinc-300">{Math.round(globalVolume * 100)}%</span>
            </div>
            <Slider
              aria-label="Global Volume:"
              max={1}
              min={0}
              onValueChange={(values) => setVolume(values[0] ?? 0)}
              step={0.01}
              value={[globalVolume]}
            />
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-100">Real Time Add/Remove Tracks (longer load on play)</p>
                  <p className="text-xs leading-5 text-zinc-400">Keep a live session open and fade tracks in or out as you click.</p>
                </div>
                <Switch
                  aria-label="Real Time Add/Remove Tracks (longer load on play)"
                  checked={isRealtimeEnabled}
                  onCheckedChange={setRealtimeEnabled}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-100">Repeat</p>
                  <p className="text-xs leading-5 text-zinc-400">Loop the active playback session when the loaded tracks end.</p>
                </div>
                <Switch aria-label="Repeat" checked={isRepeatEnabled} onCheckedChange={setRepeatEnabled} />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100" id="loadingIndicator" role="status">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            <span>Loading Tracks...</span>
          </div>
        ) : null}

        <div className="button-row">
          <Button className="sm:flex-1" onClick={playSelection} type="button">
            <Music2 aria-hidden="true" className="size-4" />
            Play Selected Tracks
          </Button>
          <Button className="sm:flex-1" onClick={stopPlayback} type="button" variant="secondary">
            <Pause aria-hidden="true" className="size-4" />
            Stop All Music
          </Button>
          <Button onClick={() => randomizeSelection()} type="button" variant="outline">
            <Shuffle aria-hidden="true" className="size-4" />
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
            <Copy aria-hidden="true" className="size-4" />
            Generate Shareable Link
          </Button>
          <Button onClick={openTweetComposer} type="button" variant="secondary">
            <Repeat2 aria-hidden="true" className="size-4" />
            Tweet Mix
          </Button>
        </div>

        {copyNoticeVisible ? (
          <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-50">
            <AlertTitle>URL Copied to Clipboard</AlertTitle>
            <AlertDescription>Share the current selection or drop it into your next post.</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
