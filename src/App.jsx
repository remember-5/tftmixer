import { Separator } from '@/components/ui/separator';
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
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[28px] border border-white/12 bg-black/35 px-5 py-6 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300/80">Remix Rumble Mixer</p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                TFT Remix Rumble Music Mixer
              </h1>
              <h2 className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Select tracks to play. Layer multiple tracks together to create unique combinations.
              </h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-zinc-200">
              Live layering, presets, share links
            </div>
          </div>
        </section>

        <MixerControls />

        <Separator className="bg-white/10" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <TraitGrid traits={traits} />
          <PresetList presets={presets} />
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
