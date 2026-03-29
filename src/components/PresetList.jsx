import { Button } from '@/components/ui/button';
import { useMixerStore } from '../store/MixerStoreContext.jsx';

function hasSameTrackMultiset(leftTrackIds, rightTrackIds) {
  if (leftTrackIds.length !== rightTrackIds.length) {
    return false;
  }

  const counts = new Map();

  for (const trackId of leftTrackIds) {
    counts.set(trackId, (counts.get(trackId) ?? 0) + 1);
  }

  for (const trackId of rightTrackIds) {
    const remaining = counts.get(trackId);

    if (!remaining) {
      return false;
    }

    if (remaining === 1) {
      counts.delete(trackId);
      continue;
    }

    counts.set(trackId, remaining - 1);
  }

  return counts.size === 0;
}

export default function PresetList({ presets }) {
  const selectedTrackIds = useMixerStore((state) => state.selectedTrackIds);
  const applySelection = useMixerStore((state) => state.applySelection);

  return (
    <section className="preset-shelf-card">
      <div className="preset-shelf-header">
        <h3>Reddit Community Presets</h3>
        <p>Start from a community mix, then tweak the layers below.</p>
      </div>

      <ul className="preset-shelf-scroll">
        {presets.map((preset) => {
          const active = hasSameTrackMultiset(preset.trackIds, selectedTrackIds);

          return (
            <li key={preset.id} className="preset-shelf-item">
              <Button
                aria-label={preset.name}
                aria-pressed={active}
                className={active ? 'preset-chip preset-chip-active' : 'preset-chip'}
                onClick={() => applySelection(preset.trackIds)}
                type="button"
                variant={active ? 'default' : 'outline'}
              >
                <span>{preset.name}</span>
                <span aria-hidden="true" className="preset-chip-meta">{preset.trackIds.length} tracks</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
