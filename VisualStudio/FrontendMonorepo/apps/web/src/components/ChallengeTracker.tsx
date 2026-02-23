import React, { useEffect, useState } from 'react';
function sendAnalyticsEvent(event) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}
import { Paper, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';

export default function ChallengeTracker({ playerId }: { playerId: string }) {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/player/${playerId}/challenges`)
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        sendAnalyticsEvent({ type: 'challenge_tracker_view', value: 1, userId: playerId, timestamp: Date.now(), meta: { section: 'ChallengeTracker' } });
      });
  }, [playerId]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Daily & Weekly Challenges</Typography>
      <List>
        {challenges.map((challenge: any) => (
          <ListItem key={challenge.id}>
            <ListItemText primary={challenge.title} secondary={challenge.description} />
            <LinearProgress variant="determinate" value={challenge.progress} sx={{ width: 120, ml: 2 }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
