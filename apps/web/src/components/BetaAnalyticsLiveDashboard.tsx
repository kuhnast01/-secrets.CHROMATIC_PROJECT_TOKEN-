import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function BetaAnalyticsLiveDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  // Example: aggregate event types
  const eventTypeCounts = events.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventTypeData = Object.entries(eventTypeCounts).map(([type, value]) => ({ type, value }));

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>Live Beta Analytics Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Event Type Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={eventTypeData} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={100}>
                  {eventTypeData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Recent Events</Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {events.slice(-20).reverse().map((e, idx) => (
                <Box key={idx} sx={{ mb: 2, borderBottom: '1px solid #333' }}>
                  <Typography variant="body1"><strong>{e.type}</strong> - {e.userId || 'anon'} - {new Date(e.timestamp).toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">{JSON.stringify(e.meta)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
