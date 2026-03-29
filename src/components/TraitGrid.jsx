function TraitCard({ onToggle, selectedTrackSet, trait }) {
  return (
    <div className="trait">
      {trait.icon ? <img alt={trait.name} src={trait.icon} /> : null}
      <h3>{trait.name}</h3>
      {trait.tracks.map((entry) => (
        <div className="track-row" key={entry.id}>
          <input
            aria-label={`${trait.name} ${entry.label}`}
            checked={selectedTrackSet.has(entry.id)}
            className={entry.phase ?? undefined}
            id={entry.id}
            name={entry.id}
            onChange={() => onToggle(entry.id)}
            type="checkbox"
          />
          <label htmlFor={entry.id}>{entry.label}</label>
        </div>
      ))}
    </div>
  );
}

export default function TraitGrid({ selectedTrackIds, traits, onToggleTrack }) {
  const selectedTrackSet = new Set(selectedTrackIds);

  return (
    <div className="trait-container">
      {traits.map((trait) => (
        <TraitCard key={trait.id} onToggle={onToggleTrack} selectedTrackSet={selectedTrackSet} trait={trait} />
      ))}
    </div>
  );
}
