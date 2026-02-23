import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

export default function BetaAnomalyAlertDashboard() {
  const [anomalies, setAnomalies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/anomalies')
      .then(res => res.json())
      .then(data => {
        setAnomalies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading anomaly data...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Anomaly Detection Dashboard</Typography>
      <Paper sx={{ p: 3 }}>
        {anomalies.retentionRisk && (
          <Alert severity="warning">Retention risk detected: Low session count</Alert>
        )}
        {anomalies.monetizationAnomaly && (
          <Alert severity="error">Monetization anomaly detected: Low purchase count</Alert>
        )}
        {!anomalies.retentionRisk && !anomalies.monetizationAnomaly && (
          <Alert severity="success">No anomalies detected</Alert>
        )}
      </Paper>
    </Box>
  );
}
