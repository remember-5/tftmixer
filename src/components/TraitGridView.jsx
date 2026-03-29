import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { isTrackSelected, isTraitSelected } from './traitGrid.helpers.js';

function TrackRow({ onToggleTrack, selectedTrackIdSet, track, traitName }) {
  const trackSelected = isTrackSelected(track.id, selectedTrackIdSet);

  return (
    <label
      className={cn(
        'track-row rounded-lg border border-white/8 bg-black/20 px-2.5 py-1.5 transition hover:border-white/16 hover:bg-white/8',
        trackSelected && 'track-row-selected'
      )}
      data-selected={trackSelected ? 'true' : 'false'}
      data-testid={`track-row-${track.id}`}
    >
      <Checkbox
        aria-label={`${traitName} ${track.label}`}
        checked={trackSelected}
        onCheckedChange={() => onToggleTrack(track.id)}
      />
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="truncate text-[13px] text-zinc-100">{track.label}</span>
        {track.phase ? (
          <span className="rounded-full border border-white/8 bg-white/6 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {track.phase}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function TraitCard({ onToggleTrack, selectedTrackIdSet, trait }) {
  const traitSelected = isTraitSelected(trait, selectedTrackIdSet);

  return (
    <Card
      className={cn('trait-card border-white/10 bg-white/6 text-white shadow-xl backdrop-blur-sm', traitSelected && 'trait-card-selected')}
      data-selected={traitSelected ? 'true' : 'false'}
      data-testid={`trait-card-${trait.id}`}
    >
      <CardHeader className="gap-2 border-b border-white/8 px-4 pb-3">
        <div className="flex items-center gap-2.5">
          {trait.icon ? <img alt={trait.name} className="size-10 rounded-xl border border-white/12 bg-black/25 p-1" src={trait.icon} /> : null}
          <div>
            <CardTitle className="text-base text-white">{trait.name}</CardTitle>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Trait Tracks</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 px-4">
        {trait.tracks.map((track) => (
          <TrackRow
            key={track.id}
            onToggleTrack={onToggleTrack}
            selectedTrackIdSet={selectedTrackIdSet}
            track={track}
            traitName={trait.name}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default function TraitGridView({ onToggleTrack, selectedTrackIdSet, traits }) {
  return (
    <div className="trait-container">
      {traits.map((trait) => (
        <TraitCard key={trait.id} onToggleTrack={onToggleTrack} selectedTrackIdSet={selectedTrackIdSet} trait={trait} />
      ))}
    </div>
  );
}
