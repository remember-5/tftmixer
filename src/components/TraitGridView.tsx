import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { isTrackSelected, isTraitSelected } from './traitGrid.helpers';
import type { Track, Trait } from '@/types/mixer';

interface TrackRowProps {
  onToggleTrack: (trackId: string) => void;
  selectedTrackIdSet: ReadonlySet<string>;
  track: Track;
  traitName: string;
}

interface TraitCardProps {
  onToggleTrack: (trackId: string) => void;
  selectedTrackIdSet: ReadonlySet<string>;
  trait: Trait;
}

interface TraitGridViewProps {
  onToggleTrack: (trackId: string) => void;
  selectedTrackIdSet: ReadonlySet<string>;
  traits: Trait[];
}

function TrackRow({ onToggleTrack, selectedTrackIdSet, track, traitName }: TrackRowProps) {
  const trackSelected = isTrackSelected(track.id, selectedTrackIdSet);

  return (
    <label
      className={cn(
        'track-row',
        trackSelected && 'track-row-selected'
      )}
      data-selected={trackSelected ? 'true' : 'false'}
      data-testid={`track-row-${track.id}`}
    >
      <Checkbox
        aria-label={`${traitName} ${track.label}`}
        checked={trackSelected}
        className="track-row-checkbox"
        onCheckedChange={() => onToggleTrack(track.id)}
      />
      <span className="track-row-copy">
        <span className="track-row-label">{track.label}</span>
      </span>
    </label>
  );
}

function TraitCard({ onToggleTrack, selectedTrackIdSet, trait }: TraitCardProps) {
  const traitSelected = isTraitSelected(trait, selectedTrackIdSet);
  const selectedCount = trait.tracks.filter((track: Track) => isTrackSelected(track.id, selectedTrackIdSet)).length;

  return (
    <Card
      className={cn('trait-card', traitSelected && 'trait-card-selected')}
      data-selected={traitSelected ? 'true' : 'false'}
      data-testid={`trait-card-${trait.id}`}
    >
      <CardHeader className="trait-card-header">
        <div className="trait-card-heading">
          {trait.icon ? (
            <span className="trait-card-icon-shell">
              <img alt={trait.name} className="trait-card-icon" src={trait.icon} />
            </span>
          ) : null}
          <div className="trait-card-copy">
            <CardTitle className="trait-card-title">{trait.name}</CardTitle>
            <CardDescription className="trait-card-description">{trait.tracks.length} trait tracks</CardDescription>
          </div>
        </div>
        <Badge className="trait-card-badge" variant="secondary">
          {selectedCount}/{trait.tracks.length}
        </Badge>
      </CardHeader>
      <CardContent className="trait-card-content">
        {trait.tracks.map((track: Track) => (
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

export default function TraitGridView({ onToggleTrack, selectedTrackIdSet, traits }: TraitGridViewProps) {
  return (
    <div className="trait-container" data-card-width="fluid-5-up" data-density="dense" data-layout="compact-5-up">
      {traits.map((trait: Trait) => (
        <TraitCard key={trait.id} onToggleTrack={onToggleTrack} selectedTrackIdSet={selectedTrackIdSet} trait={trait} />
      ))}
    </div>
  );
}
