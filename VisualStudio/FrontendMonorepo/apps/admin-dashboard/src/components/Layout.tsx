import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAdminSession } from '../context/AdminSessionContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import { TextField } from '@mui/material';
import styles from './Layout.module.css';

function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);
  const handleSend = () => {
    // Simulate sending feedback (replace with real API call)
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFeedback('');
      onClose();
    }, 1500);
  };
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Feedback & Support</h2>
        <p>Send us your feedback or request support. We'll review and respond promptly.</p>
        <TextField
          label="Your feedback"
          multiline
          minRows={3}
          fullWidth
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          disabled={sent}
        />
        <div className="modal-actions">
          <Button variant="contained" color="primary" onClick={handleSend} disabled={!feedback || sent}>
            {sent ? 'Sent!' : 'Send Feedback'}
          </Button>
          <Button variant="outlined" onClick={onClose} disabled={sent}>Close</Button>
        </div>
        <div className="modal-support">
          <b>Support:</b> <a href="mailto:support@example.com">Contact Support</a><br />
          <b>FAQ:</b> <a href="#faq" onClick={() => alert('FAQ coming soon!')}>Read FAQ</a>
        </div>
      </div>
    </div>
  );
}

function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className={styles.onboardingModalOverlay}>
      <div className={styles.onboardingModalContent}>
        <h2>Welcome to the Admin Dashboard</h2>
        <p>This guided onboarding will help you get started and understand key features.</p>
        <ul>
          <li><b>Checklist:</b> <a href="/apps/admin-dashboard/ADMIN_CHECKLIST.md" target="_blank" rel="noopener">View onboarding checklist</a></li>
          <li><b>Help:</b> <a href="#help" onClick={() => alert('Dashboard help coming soon!')}>Dashboard Help</a></li>
          <li><b>FAQ:</b> <a href="#faq" onClick={() => alert('FAQ coming soon!')}>Read FAQ</a></li>
          <li><b>Support:</b> <a href="mailto:support@example.com">Contact Support</a></li>
        </ul>
        <Button variant="contained" color="primary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

const Layout: React.FC = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { isAuthenticated, logout } = useAdminSession();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/security">Security</Button>
          <Button color="inherit" component={Link} to="/updates">Updates</Button>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/shop">Shop</Button>
          <Button color="inherit" component={Link} to="/events">Events</Button>
          <Button color="inherit" component={Link} to="/audit-log">Audit Log</Button>
          <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
          <Button color="secondary" variant="outlined" style={{ marginLeft: 16 }} onClick={() => setOnboardingOpen(true)}>
            Onboarding & Help
          </Button>
          <Button color="secondary" variant="outlined" style={{ marginLeft: 8 }} href="http://localhost:4000/api-docs" target="_blank" rel="noopener">
            API Docs
          </Button>
          <Button color="secondary" variant="outlined" style={{ marginLeft: 8 }} onClick={() => setFeedbackOpen(true)}>
            Feedback & Support
          </Button>
          <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
          {isAuthenticated && (
            <Button color="error" variant="outlined" style={{ marginLeft: 16 }} onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
