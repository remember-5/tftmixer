import { describe, expect, it } from 'vitest';
import { buildShareUrl, buildTweetUrl, parseSelectedTracks } from './urlState.js';

describe('urlState', () => {
  it('parses comma-separated track ids and strips legacy trailing dots', () => {
    expect(parseSelectedTracks('?selectedTracks=kda_late_main,punk_late_main.')).toEqual([
      'kda_late_main',
      'punk_late_main'
    ]);
  });

  it('builds a share url with the selectedTracks query param', () => {
    expect(buildShareUrl('https://tftmixer.officiallysp.net/', ['kda_late_main', 'punk_late_main'])).toBe(
      'https://tftmixer.officiallysp.net/?selectedTracks=kda_late_main%2Cpunk_late_main'
    );
  });

  it('builds an X intent url with the share link embedded in the text', () => {
    expect(buildTweetUrl('https://tftmixer.officiallysp.net/', ['kda_late_main'])).toContain(
      encodeURIComponent('https://tftmixer.officiallysp.net/?selectedTracks=kda_late_main')
    );
  });
});
