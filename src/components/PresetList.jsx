import { Button } from '@/components/ui/button';
import { useMixerStore } from '../store/MixerStoreContext.jsx';

export default function PresetList({ presets }) {
  const selectedTrackIds = useMixerStore((state) => state.selectedTrackIds);
  const applySelection = useMixerStore((state) => state.applySelection);
  const selectedTrackSet = new Set(selectedTrackIds);

  function isPresetActive(presetTrackIds) {
    return (
      presetTrackIds.length === selectedTrackIds.length &&
      presetTrackIds.every((trackId) => selectedTrackSet.has(trackId))
    );
  }

  return (
    <section className="preset-shelf-card">
      <div className="preset-shelf-header">
        <h3>Reddit Community Presets</h3>
        <p>Start from a community mix, then tweak the layers below.</p>
      </div>

      <div className="preset-shelf-scroll" role="list">
        {presets.map((preset) => {
          const active = isPresetActive(preset.trackIds);

          return (
            <Button
              key={preset.id}
              aria-pressed={active}
              className={active ? 'preset-chip preset-chip-active' : 'preset-chip'}
              onClick={() => applySelection(preset.trackIds)}
              type="button"
              variant={active ? 'default' : 'outline'}
            >
              <span>{preset.name}</span>
              <span className="preset-chip-meta">{preset.trackIds.length} tracks</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
