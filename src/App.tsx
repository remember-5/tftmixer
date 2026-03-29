import { useShallow } from 'zustand/react/shallow';
import MixerControls from './components/MixerControls';
import PresetList from './components/PresetList';
import TraitGrid from './components/TraitGrid';
import { MixerStoreProvider, useMixerStore } from './store/MixerStoreContext';
import type { AudioMixerPlayer } from '@/types/mixer';

function MixerPage() {
  const { presets, traits } = useMixerStore(
    useShallow((state) => ({
      presets: state.presets,
      traits: state.traits
    }))
  );

  return (
    <div className="page-shell">
      <div className="page-aurora" />
      <div className="page-scrim" />
      <main className="page-frame">
        <section aria-label="Mixer operations bar" className="operations-shell" data-density="compact">
          <MixerControls />
        </section>

        <section aria-label="Mixer board" className="mix-board">
          <section aria-label="Sound blocks grid" className="workspace-panel workspace-traits">
            <div className="workspace-panel-heading">
              <p className="workspace-kicker">Sound Blocks</p>
              <h2>Trait Modules</h2>
            </div>
            <div className="workspace-panel-body workspace-panel-body-scroll">
              <TraitGrid traits={traits} />
            </div>
          </section>

          <section aria-label="Community preset deck" className="workspace-panel workspace-presets" data-panel-width="wide">
            <div className="workspace-panel-heading">
              <p className="workspace-kicker">Preset Deck</p>
              <h2>Reddit Community Presets</h2>
            </div>
            <div className="workspace-panel-body">
              <PresetList presets={presets} />
            </div>
          </section>
        </section>
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
