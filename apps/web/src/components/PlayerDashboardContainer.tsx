import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography, Button, Paper, Grid } from '@mui/material';
import PlayerAnalyticsDashboard from './PlayerAnalyticsDashboard';
import AchievementPopup from './AchievementPopup';
import Leaderboard from './Leaderboard';
import ChallengeTracker from './ChallengeTracker';
import BattleHighlights from './BattleHighlights';
import SocialShareButton from './SocialShareButton';

// Example skin/theme configs
const skins = {
  default: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#1976d2' },
      secondary: { main: '#ff4081' },
      background: { default: '#181a1b', paper: '#23272a' },
      text: { primary: '#fff', secondary: '#b0b0b0' },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: { fontWeight: 700 },
    },
  }),
  cyberpunk: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#00fff7' },
      secondary: { main: '#ff00ea' },
      background: { default: '#0f0f23', paper: '#1a1a2e' },
      text: { primary: '#e0e0e0', secondary: '#ff00ea' },
    },
    typography: {
      fontFamily: 'Orbitron, Roboto, Arial, sans-serif',
      h4: { fontWeight: 900 },
    },
  }),
  military: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#4b5320' },
      secondary: { main: '#c19a6b' },
      background: { default: '#2e2e2e', paper: '#3b3b3b' },
      text: { primary: '#e5e5e5', secondary: '#c19a6b' },
    },
    typography: {
      fontFamily: 'Oswald, Arial, sans-serif',
      h4: { fontWeight: 700 },
    },
  }),
};

export default function PlayerDashboardContainer({ playerId }: { playerId: string }) {
  const [skin, setSkin] = useState<'default' | 'cyberpunk' | 'military'>('default');
  const [achievementOpen, setAchievementOpen] = useState(false);
  const [achievement, setAchievement] = useState<{ title: string; description: string } | null>(null);

  // Example: trigger achievement popup
  const handleAchievement = (ach: { title: string; description: string }) => {
    setAchievement(ach);
    setAchievementOpen(true);
  };

  const handleCloseAchievement = () => {
    setAchievementOpen(false);
    setAchievement(null);
  };

  return (
    <ThemeProvider theme={skins[skin]}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Player Dashboard
            </Typography>
            <Button color="secondary" onClick={() => setSkin('default')}>Default</Button>
            <Button color="secondary" onClick={() => setSkin('cyberpunk')}>Cyberpunk</Button>
            <Button color="secondary" onClick={() => setSkin('military')}>Military</Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={4} sx={{ p: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <PlayerAnalyticsDashboard playerId={playerId} />
            </Paper>
            <Paper sx={{ p: 3, mb: 4 }}>
              <ChallengeTracker playerId={playerId} />
            </Paper>
            <Paper sx={{ p: 3, mb: 4 }}>
              <BattleHighlights playerId={playerId} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Leaderboard type="global" />
            </Paper>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Leaderboard type="friends" />
            </Paper>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Leaderboard type="faction" />
            </Paper>
            <Paper sx={{ p: 3, mb: 4 }}>
              <SocialShareButton text="Check out my stats!" url={window.location.href} />
            </Paper>
          </Grid>
        </Grid>
        {achievement && (
          <AchievementPopup open={achievementOpen} achievement={achievement} onClose={handleCloseAchievement} />
        )}
      </Box>
    </ThemeProvider>
  );
}
