import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableContentBlock from '../components/DraggableContentBlock';
import { Typography, Box, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { apiRequest } from '../api';
import { useAdminSession } from '../context/AdminSessionContext';
import { useAdminAutomation } from '../utils/useAdminAutomation';
import { HelpTooltip } from '../components/HelpTooltip';
// You can use recharts or chart.js for real charts; here is a placeholder

const initialBlocks = [
  { id: 'analytics-info', content: <Typography variant="h5">Analytics Dashboard</Typography> },
  { id: 'analytics-image', content: <img src="https://placekitten.com/320/120" alt="analytics graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> },
  { id: 'analytics-widget', content: <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 4 }}>Widget: Metrics Overview</Box> },
];

const Analytics: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  // Admin automation wiring
  const { isAuthenticated } = useAdminSession();
  const {
    dryRunResult, dryRunOpen, setDryRunOpen,
    auditLog, auditOpen, setAuditOpen,
    handleDryRun, handleAuditLog
  } = useAdminAutomation('analytics');
    /**
     * Admin Automation Controls (Dry-Run, Audit Log)
     * - Dry-run: Preview effect of analytics reset or bulk action without making changes.
     * - Audit log: View all admin actions for Analytics.
     * - Integration Docs: See ADMIN_UI_BACKEND_INTEGRATION.md for troubleshooting and maintenance.
     */
  const [blocks, setBlocks] = useState(initialBlocks);
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = blocks.findIndex(b => b.id === active.id);
        const newIndex = blocks.findIndex(b => b.id === over.id);
        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, moved);
        setBlocks(newBlocks);
      }
    };
    // Example: Add new text block
    const addTextBlock = () => {
      setBlocks([...blocks, { id: `text-${Date.now()}`, content: <Typography>New analytics text block</Typography> }]);
    };
    // Example: Add new image block
    const addImageBlock = () => {
      setBlocks([...blocks, { id: `img-${Date.now()}`, content: <img src="https://placekitten.com/320/120" alt="added analytics graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> }]);
    };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/admin/analytics')
      .then(setMetrics)
      .catch(e => { setError(e.message || 'Failed to load analytics'); })
      .finally(() => { setLoading(false); });
  }, []);

  return (
    <Box>
      {/* Drag-and-drop content blocks section */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={addTextBlock} sx={{ mr: 1 }}>Add Text Block</Button>
        <Button variant="outlined" onClick={addImageBlock}>Add Image Block</Button>
        {isAuthenticated && (
          <>
            <Button onClick={() => handleDryRun('reset', {})} variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Dry-Run Analytics Reset
              <HelpTooltip title="Preview the effect of an analytics reset without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." />
            </Button>
            <Button onClick={handleAuditLog} variant="outlined" color="info" sx={{ ml: 1 }}>
              View Audit Log
              <HelpTooltip title="View all admin actions for Analytics. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." />
            </Button>
            <Button href="/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md" target="_blank" sx={{ ml: 1 }}>
              Integration Docs
            </Button>
          </>
        )}
      </Box>
            {/* Dry-Run Result Dialog */}
            <Dialog open={dryRunOpen} onClose={() => setDryRunOpen(false)}>
              <DialogTitle>Dry-Run Result</DialogTitle>
              <DialogContent>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(dryRunResult, null, 2)}</pre>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDryRunOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            {/* Audit Log Dialog */}
            <Dialog open={auditOpen} onClose={() => setAuditOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle>Analytics Audit Log Summary</DialogTitle>
              <DialogContent>
                <List>
                  {auditLog.map((log, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={log.message} secondary={log.timestamp} />
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAuditOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map(block => (
            <DraggableContentBlock key={block.id} id={block.id}>
              {block.content}
            </DraggableContentBlock>
          ))}
        </SortableContext>
      </DndContext>
      {/* Original analytics features */}
      <Typography variant="h5">Analytics Dashboard</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {metrics && (
          <>
            <Typography>Total Users: {metrics.totalUsers}</Typography>
            <Typography>Active Events: {metrics.activeEvents}</Typography>
            <Typography>Revenue (This Month): ${metrics.revenueThisMonth}</Typography>
            {/* Add charts here using recharts or chart.js */}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Analytics;