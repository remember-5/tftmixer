import { useEffect, useRef, useState } from 'react';
import { buildShareUrl, buildTweetUrl } from '../lib/urlState.js';

function getBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

export function useShareActions({ selectedTrackIds }) {
  const copyNoticeTimeoutRef = useRef();
  const [copyNoticeVisible, setCopyNoticeVisible] = useState(false);

  useEffect(() => () => clearTimeout(copyNoticeTimeoutRef.current), []);

  function showCopyNotice() {
    setCopyNoticeVisible(true);
    clearTimeout(copyNoticeTimeoutRef.current);
    copyNoticeTimeoutRef.current = setTimeout(() => setCopyNoticeVisible(false), 2000);
  }

  async function copyShareLink() {
    const shareUrl = buildShareUrl(getBaseUrl(), selectedTrackIds);
    await navigator.clipboard.writeText(shareUrl);
    showCopyNotice();
  }

  function openTweetComposer() {
    const tweetWindow = window.open(buildTweetUrl(getBaseUrl(), selectedTrackIds), '_blank');
    tweetWindow?.focus();
  }

  return {
    copyNoticeVisible,
    copyShareLink,
    openTweetComposer
  };
}
