import { describe, expect, it } from 'vitest';
import { presets, trackIds, traits } from './catalog.js';

describe('catalog', () => {
  it('retains the legacy trait and track coverage', () => {
    expect(traits).toHaveLength(16);
    expect(trackIds).toHaveLength(68);

    const kda = traits.find((trait) => trait.name === 'KDA');
    const otherTracks = traits.find((trait) => trait.name === 'Other Tracks');

    expect(kda?.tracks).toHaveLength(6);
    expect(otherTracks?.tracks.some((track) => track.id === 'starting_carousel')).toBe(true);
    expect(otherTracks?.tracks.some((track) => track.id === 'death6')).toBe(true);
  });

  it('keeps every preset pointing at a known track id', () => {
    expect(presets).toHaveLength(16);

    const knownTrackIds = new Set(trackIds);
    for (const preset of presets) {
      expect(preset.trackIds.length).toBeGreaterThan(0);
      for (const trackId of preset.trackIds) {
        expect(knownTrackIds.has(trackId)).toBe(true);
      }
    }
  });
});
