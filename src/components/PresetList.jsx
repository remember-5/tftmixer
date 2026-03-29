export default function PresetList({ onApplyPreset, presets }) {
  return (
    <aside className="community-presets">
      <h3>Reddit Community Presets</h3>
      <ul>
        {presets.map((preset) => (
          <li key={preset.id}>
            <button onClick={() => onApplyPreset(preset.trackIds)} type="button">
              {preset.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
