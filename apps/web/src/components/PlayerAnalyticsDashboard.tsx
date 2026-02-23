import React, { useEffect, useState } from 'react';
function sendAnalyticsEvent(event) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PlayerAnalyticsDashboard({ playerId }: { playerId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/player/${playerId}/analytics`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        sendAnalyticsEvent({ type: 'dashboard_view', value: 1, userId: playerId, timestamp: Date.now(), meta: { section: 'PlayerAnalyticsDashboard' } });
      })
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading) return <CircularProgress />;
  if (!data) return <Typography>No analytics found.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Personal Game Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Progression Over Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.progression}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="level" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Battle Outcomes</Typography>
            <PieChart width={250} height={250}>
              <Pie data={data.battles} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80}>
                {data.battles.map((entry: any, idx: number) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Top Used Ships</Typography>
            <ul>
              {data.topShips.map((ship: any) => (
                <li key={ship.name}>{ship.name} — {ship.uses} uses</li>
              ))}
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Achievements</Typography>
            <ul>
              {data.achievements.map((ach: any) => (
                <li key={ach.id}>{ach.title} — {ach.date}</li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
