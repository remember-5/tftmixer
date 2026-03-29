import type { Trait } from '@/types/mixer';

export function createSelectedTrackIdSet(selectedTrackIds: string[] = []): Set<string> {
  return new Set(selectedTrackIds);
}

export function isTraitSelected(trait: Trait, selectedTrackIdSet: ReadonlySet<string>): boolean {
  return trait.tracks.some((entry) => selectedTrackIdSet.has(entry.id));
}

export function isTrackSelected(trackId: string, selectedTrackIdSet: ReadonlySet<string>): boolean {
  return selectedTrackIdSet.has(trackId);
}
