function TraitCard({ selection, trait }) {
  return (
    <div className="trait">
      {trait.icon ? <img alt={trait.name} src={trait.icon} /> : null}
      <h3>{trait.name}</h3>
      {trait.tracks.map((entry) => (
        <div className="track-row" key={entry.id}>
          <input
            aria-label={`${trait.name} ${entry.label}`}
            checked={selection.isTrackSelected(entry.id)}
            className={entry.phase ?? undefined}
            id={entry.id}
            name={entry.id}
            onChange={() => selection.toggleTrack(entry.id)}
            type="checkbox"
          />
          <label htmlFor={entry.id}>{entry.label}</label>
        </div>
      ))}
    </div>
  );
}

export default function TraitGrid({ selection, traits }) {
  return (
    <div className="trait-container">
      {traits.map((trait) => (
        <TraitCard key={trait.id} selection={selection} trait={trait} />
      ))}
    </div>
  );
}
