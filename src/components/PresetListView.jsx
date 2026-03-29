import { Button } from '@/components/ui/button';

export default function PresetListView({ onSelectPreset, presetItems }) {
  return (
    <section className="preset-shelf-card">
      <div className="preset-shelf-header">
        <h3>Reddit Community Presets</h3>
        <p>Start from a community mix, then tweak the layers below.</p>
      </div>

      <ul className="preset-shelf-scroll">
        {presetItems.map((preset) => (
          <li key={preset.id} className="preset-shelf-item">
            <Button
              aria-label={preset.name}
              aria-pressed={preset.active}
              className={preset.active ? 'preset-chip preset-chip-active' : 'preset-chip'}
              onClick={() => onSelectPreset(preset.trackIds)}
              type="button"
              variant={preset.active ? 'default' : 'outline'}
            >
              <span>{preset.name}</span>
              <span aria-hidden="true" className="preset-chip-meta">{preset.trackIds.length} tracks</span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
