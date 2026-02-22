import React from 'react';
import { Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

function sendAnalyticsEvent(event: any) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}

interface SocialShareButtonProps {
  text: string;
  url: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({ text, url }) => {
  const handleShare = () => {
    sendAnalyticsEvent({ type: 'social_share', value: 1, userId: undefined, timestamp: Date.now(), meta: { text, url } });
    if (navigator.share) {
      navigator.share({ title: text, url });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
      Share
    </Button>
  );
};

export default SocialShareButton;
