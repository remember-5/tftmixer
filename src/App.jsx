import Credits from './components/Credits.jsx';
import MixerControls from './components/MixerControls.jsx';
import PresetList from './components/PresetList.jsx';
import TraitGrid from './components/TraitGrid.jsx';
import { MixerStoreProvider, useMixerStore } from './store/MixerStoreContext.jsx';

function MixerPage() {
  const presets = useMixerStore((state) => state.presets);
  const traits = useMixerStore((state) => state.traits);

  return (
    <div className="page-shell">
      <div className="page-aurora" />
      <div className="page-scrim" />
      <main className="page-frame">
        <section className="hero-panel">
          <p className="hero-kicker">Remix Rumble Mixer</p>
          <div className="hero-copy">
            <div>
              <h1>TFT Remix Rumble Music Mixer</h1>
              <h2>Select tracks to play. Layer multiple tracks together to create unique combinations.</h2>
            </div>
            <div className="hero-badge">Live layering, presets, share links</div>
          </div>
        </section>

        <div className="command-deck-layout">
          <aside className="command-deck-column">
            <MixerControls />
          </aside>

          <section className="workspace-column">
            <PresetList presets={presets} />
            <TraitGrid traits={traits} />
          </section>
        </div>

        <Credits />
      </main>
    </div>
  );
}

export default function App({ player }) {
  return (
    <MixerStoreProvider player={player}>
      <MixerPage />
    </MixerStoreProvider>
  );
}
