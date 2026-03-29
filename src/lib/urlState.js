export function parseSelectedTracks(search = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const selectedTracks = params.get('selectedTracks');

  if (!selectedTracks) {
    return [];
  }

  return selectedTracks
    .split(',')
    .map((trackId) => trackId.replace(/\.+$/, '').trim())
    .filter(Boolean);
}

export function buildShareUrl(baseUrl, selectedTrackIds = []) {
  const url = new URL(baseUrl);

  if (selectedTrackIds.length > 0) {
    url.searchParams.set('selectedTracks', selectedTrackIds.join(','));
  } else {
    url.searchParams.delete('selectedTracks');
  }

  return url.toString();
}

export function buildTweetUrl(baseUrl, selectedTrackIds = []) {
  const shareUrl = buildShareUrl(baseUrl, selectedTrackIds);
  return `https://x.com/intent/tweet?text=${encodeURIComponent(
    `Check out my TFT remix rumble music mix!: ${shareUrl}`
  )}&hashtags=TFT,TFTRemixRumble`;
}
