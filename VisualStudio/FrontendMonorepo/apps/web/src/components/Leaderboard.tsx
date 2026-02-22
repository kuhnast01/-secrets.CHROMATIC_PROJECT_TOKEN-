import React, { useEffect, useState } from 'react';
function sendAnalyticsEvent(event) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Leaderboard({ type }: { type: 'global' | 'friends' | 'faction' }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/leaderboard/${type}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        sendAnalyticsEvent({ type: 'leaderboard_view', value: 1, userId: undefined, timestamp: Date.now(), meta: { leaderboardType: type } });
      });
  }, [type]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">{type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={row.playerId}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{row.playerName}</TableCell>
                <TableCell>{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
