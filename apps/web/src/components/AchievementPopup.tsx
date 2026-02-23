import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

function sendAnalyticsEvent(event: any) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}

interface AchievementPopupProps {
  open: boolean;
  achievement: { title: string; description: string };
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ open, achievement, onClose }) => {
  useEffect(() => {
    if (open && achievement) {
      sendAnalyticsEvent({ type: 'achievement_popup', value: 1, userId: undefined, timestamp: Date.now(), meta: { achievement } });
    }
  }, [open, achievement]);
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        <strong>{achievement.title}</strong><br />
        {achievement.description}
      </Alert>
    </Snackbar>
  );
};

export default AchievementPopup;
