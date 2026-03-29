import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMixerStore } from '../store/MixerStoreContext.jsx';

function TraitCard({ trait }) {
  const selectedTrackIds = useMixerStore((state) => state.selectedTrackIds);
  const toggleTrack = useMixerStore((state) => state.toggleTrack);
  const selectedTrackIdSet = new Set(selectedTrackIds);
  const traitSelected = trait.tracks.some((entry) => selectedTrackIdSet.has(entry.id));

  return (
    <Card
      className={cn('trait-card border-white/10 bg-white/6 text-white shadow-xl backdrop-blur-sm', traitSelected && 'trait-card-selected')}
      data-selected={traitSelected ? 'true' : 'false'}
      data-testid={`trait-card-${trait.id}`}
    >
      <CardHeader className="gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-3">
          {trait.icon ? <img alt={trait.name} className="size-12 rounded-2xl border border-white/12 bg-black/25 p-1" src={trait.icon} /> : null}
          <div>
            <CardTitle className="text-lg text-white">{trait.name}</CardTitle>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Trait Tracks</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {trait.tracks.map((entry) => {
          const trackSelected = selectedTrackIdSet.has(entry.id);

          return (
            <label
              className={cn('track-row rounded-xl border border-white/8 bg-black/20 px-3 py-2 transition hover:border-white/16 hover:bg-white/8', trackSelected && 'track-row-selected')}
              data-selected={trackSelected ? 'true' : 'false'}
              data-testid={`track-row-${entry.id}`}
              key={entry.id}
            >
              <Checkbox
                aria-label={`${trait.name} ${entry.label}`}
                checked={trackSelected}
                onCheckedChange={() => toggleTrack(entry.id)}
              />
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="truncate text-sm text-zinc-100">{entry.label}</span>
                {entry.phase ? (
                  <span className="rounded-full border border-white/8 bg-white/6 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    {entry.phase}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function TraitGrid({ traits }) {
  return (
    <div className="trait-container">
      {traits.map((trait) => (
        <TraitCard key={trait.id} trait={trait} />
      ))}
    </div>
  );
}
