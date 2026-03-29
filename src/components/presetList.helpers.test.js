import { describe, expect, it } from 'vitest';
import { buildPresetItems, hasSameTrackMultiset } from './presetList.helpers.js';

describe('presetList helpers', () => {
  it('matches track multisets regardless of order while respecting duplicate counts', () => {
    expect(hasSameTrackMultiset(['alpha', 'beta', 'alpha'], ['alpha', 'alpha', 'beta'])).toBe(true);
    expect(hasSameTrackMultiset(['alpha', 'beta', 'alpha'], ['alpha', 'beta', 'beta'])).toBe(false);
  });

  it('marks only the preset whose track multiset matches the current selection as active', () => {
    const presetItems = buildPresetItems(
      [
        { id: 'one', name: 'One', trackIds: ['alpha', 'beta'] },
        { id: 'two', name: 'Two', trackIds: ['beta', 'beta'] }
      ],
      ['beta', 'alpha']
    );

    expect(presetItems).toEqual([
      { active: true, id: 'one', name: 'One', trackIds: ['alpha', 'beta'] },
      { active: false, id: 'two', name: 'Two', trackIds: ['beta', 'beta'] }
    ]);
  });
});
