import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import MixerControls from './components/MixerControls';
import PresetList from './components/PresetList';
import TraitGrid from './components/TraitGrid';
import { MixerStoreProvider, useMixerStore } from './store/MixerStoreContext';
import type { AudioMixerPlayer } from '@/types/mixer';

function MixerPage() {
  const presets = useMixerStore((state) => state.presets);
  const traits = useMixerStore((state) => state.traits);

  return (
    <div className="page-shell">
      <div className="page-aurora" />
      <div className="page-scrim" />
      <main className="page-frame">
        <section className="hero-shell">
          <Card className="hero-panel gap-0 py-0">
            <div className="hero-panel-content">
              <p className="hero-kicker">Remix Rumble Mixer</p>
              <div className="hero-copy">
                <div>
                  <h1>TFT Remix Rumble Music Mixer</h1>
                  <h2>Select tracks to play. Layer multiple tracks together to create unique combinations.</h2>
                </div>
                <Badge className="hero-badge" variant="secondary">
                  Live layering, presets, share links
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        <div className="command-deck-layout">
          <aside aria-label="Mixer command deck" className="command-deck-column">
            <MixerControls />
          </aside>

          <section aria-label="Mixer workspace" className="workspace-column">
            <section aria-label="Preset workspace" className="workspace-presets">
              <PresetList presets={presets} />
            </section>
            <section aria-label="Trait grid workspace" className="workspace-traits">
              <TraitGrid traits={traits} />
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App({ player }: { player?: AudioMixerPlayer }) {
  return (
    <MixerStoreProvider player={player}>
      <MixerPage />
    </MixerStoreProvider>
  );
}
