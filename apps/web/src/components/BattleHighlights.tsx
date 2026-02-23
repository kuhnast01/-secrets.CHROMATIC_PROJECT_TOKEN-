import React, { useEffect, useState } from 'react';
function sendAnalyticsEvent(event) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function BattleHighlights({ playerId }: { playerId: string }) {
  const [highlights, setHighlights] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/player/${playerId}/battle-highlights`)
      .then(res => res.json())
      .then(data => {
        setHighlights(data);
        sendAnalyticsEvent({ type: 'battle_highlights_view', value: 1, userId: playerId, timestamp: Date.now(), meta: { section: 'BattleHighlights' } });
      });
  }, [playerId]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Battle Highlights</Typography>
      <List>
        {highlights.map((highlight: any) => (
          <ListItem key={highlight.id}>
            <ListItemText primary={highlight.title} secondary={highlight.detail} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
