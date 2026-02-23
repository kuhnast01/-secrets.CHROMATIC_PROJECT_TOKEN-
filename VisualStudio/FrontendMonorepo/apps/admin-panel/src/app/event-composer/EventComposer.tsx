"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './EventComposer.module.css';
import EventTimelineEditor from './EventTimelineEditor';
import LiveOpsAnalyticsPanel from '../LiveOpsAnalyticsPanel';
import UserManagementPanel from '../UserManagementPanel';
import SystemHealthPanel from '../SystemHealthPanel';
import SecurityCompliancePanel from '../SecurityCompliancePanel';
import { t, setLanguage } from '../localization';
import { apiFetch } from '../../api';

// Define EventPhase type if not imported
type EventPhase = {
  id: string;
  name: string;
  start: string;
  end: string;
  rewards: string[];
  milestones: string[];
  bossHP?: number;
  scaling?: string;
  shopBundles?: string[];
  banners?: string[];
  difficulty?: string;
};

type EventVersion = {
  phases: EventPhase[];
  author: string;
  timestamp: string;
  status: string;
  summary: string;
};

type AuditLog = {
  user: string;
  action: string;
  timestamp: string;
  details?: unknown;
};

function AuditLogModal({ onClose, auditLogs }: { onClose: () => void; auditLogs: AuditLog[] }) {
  return (
    <div className={styles['audit-log-modal']}>
      <h2 className={styles['audit-log-title']}>Audit Log</h2>
      <ul className={styles['audit-log-list']}>
        {auditLogs.map((log, i) => (
          <li key={i} className={styles['audit-log-item']}>
            <b>{log.user}</b> — {log.action} <span className={styles['audit-log-timestamp']}>({new Date(log.timestamp).toLocaleString()})</span>

{log.details && (
  <pre className={styles['audit-log-details']}>
    {typeof log.details === 'string'
      ? log.details
      : JSON.stringify(log.details, null, 2) as string}
  </pre>
)}
// ...existing code...
            )}
          </li>
        ))}
      </ul>
      <button onClick={onClose} className={styles['audit-log-close']}>Close</button>
    </div>
  );
}

function EventComposer() {
  // Core state
  const [phases, setPhasesState] = useState<EventPhase[]>([]);
  const [versionHistory, setVersionHistory] = useState<EventVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [calendarView, setCalendarView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Persist phase order to backend
  const setPhases = (newPhases: EventPhase[] | ((prev: EventPhase[]) => EventPhase[])) => {
    const updatedPhases = typeof newPhases === 'function' ? newPhases(phases) : newPhases;
    setPhasesState(updatedPhases);
    apiFetch('/phases', {
      method: 'POST',
      body: JSON.stringify(updatedPhases),
    }).catch(() => {/* Optionally handle error */});
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch('/event-versions').catch(() => []),
      apiFetch('/phases').catch(() => []),
    ])
      .then(([versions, phases]) => {
        if (!isMounted) return;
        setVersionHistory(versions);
        setPhases(phases);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError(t('Failed to load event data.'));
        setLoading(false);
      });
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateEventConfig(phases: EventPhase[]): string[] {
    const errors: string[] = [];
    for (let i = 0; i < phases.length; i++) {
      for (let j = i + 1; j < phases.length; j++) {
        if (
          (phases[i].start < phases[j].end && phases[i].end > phases[j].start)
        ) {
          errors.push(`Phase "${phases[i].name}" overlaps with "${phases[j].name}".`);
        }
      }
    }
    phases.forEach(p => {
      if (!p.rewards || p.rewards.length === 0) {
        errors.push(`Phase "${p.name}" is missing rewards.`);
      }
    });
    return errors;
  }

  // Versioning logic (API integration)
  const handleSaveDraft = async () => {
    const errors = validateEventConfig(phases);
    if (errors.length) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }
    const summary = window.prompt('Describe this change (for version history):', '');
    const version: EventVersion = {
      phases: JSON.parse(JSON.stringify(phases)),
      author: 'admin',
      timestamp: new Date().toISOString(),
      status: 'draft',
      summary: summary || '',
    };
    try {
      await apiFetch('/event-versions', {
        method: 'POST',
        body: JSON.stringify(version),
      });
      setVersionHistory(prev => [...prev, version]);
      alert('Draft saved!');
    } catch {
      alert('Failed to save draft.');
    }
  };

  const handlePreview = () => {
    const errors = validateEventConfig(phases);
    if (errors.length) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }
    // Show preview modal or panel
    const previewContent = phases.map(phase => (
      `Phase: ${phase.name}\nStart: ${phase.start}\nEnd: ${phase.end}\nRewards: ${phase.rewards.join(', ')}\nMilestones: ${phase.milestones.join(', ')}\n`
    )).join('\n---------------------\n');
    alert('Event Preview:\n' + previewContent);
  };
  const handlePublish = async () => {
    const errors = validateEventConfig(phases);
    if (errors.length) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }
    try {
      await apiFetch('/publish-event', {
        method: 'POST',
        body: JSON.stringify({ phases, author: 'admin' }),
      });
      alert('Event published!');
    } catch {
      alert('Failed to publish.');
    }
  };
  const handleShowHistory = () => setShowHistory(true);
  const handleShowCalendar = () => setCalendarView(v => !v);
  const handleShowAudit = async () => {
    setShowAudit(true);
    try {
      const logs = await apiFetch('/audit-log');
      setAuditLogs(logs);
    } catch {
      setAuditLogs([]);
    }
  };
  const handleRollback = (idx: number) => {
    setPhases(JSON.parse(JSON.stringify(versionHistory[idx].phases)));
    setShowHistory(false);
    alert(`Rolled back to version ${idx + 1}`);
  };
  const closeHistory = () => setShowHistory(false);

  return (
    <div>
      <div className={styles['lang-select-group']}>
        <label htmlFor="lang-select" className={styles['lang-select-label']}>🌐</label>
        <select id="lang-select" onChange={e => { setLanguage(e.target.value); window.location.reload(); }} defaultValue="en">
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <h1 tabIndex={0} aria-label={t('Event Composer (Visual Builder)')}>{t('Event Composer (Visual Builder)')}</h1>
      <LiveOpsAnalyticsPanel />
      <UserManagementPanel />
      <SystemHealthPanel />
      <SecurityCompliancePanel />
      <nav aria-label={t('Event actions')} className={styles['event-composer-nav']}>
        <button onClick={handleSaveDraft} aria-label={t('Save Draft')} disabled={loading}>{t('Save Draft')}</button>
        <button onClick={handlePreview} className={styles['nav-button']} aria-label={t('Preview')} disabled={loading}>{t('Preview')}</button>
        <button onClick={handlePublish} className={styles['nav-button']} aria-label={t('Publish')} disabled={loading}>{t('Publish')}</button>
        <button onClick={handleShowHistory} className={styles['nav-button']} aria-label={t('History')} disabled={loading}>{t('History')}</button>
        <button onClick={handleShowCalendar} className={styles['nav-button']} aria-label={t('Calendar')} disabled={loading}>{calendarView ? t('Hide Calendar') : t('Calendar')}</button>
        <button onClick={handleShowAudit} className={styles['nav-button']} aria-label={t('Audit Log')} disabled={loading}>{t('Audit Log')}</button>
      </nav>
      {error && <div className={styles['event-composer-error']}>{error}</div>}
      {showAudit && <AuditLogModal onClose={() => setShowAudit(false)} auditLogs={auditLogs} />}
      {showHistory && (
        <div role="dialog" aria-modal="true" tabIndex={-1} className={styles['version-history-dialog']}>
          <h2>Version History</h2>
          <ul>
            {versionHistory.map((v, idx) => (
              <li key={idx} className={styles['version-history-item']}>
                <div><b>Status:</b> {v.status || 'draft'} | <b>Author:</b> {v.author || 'unknown'} | <b>Time:</b> {v.timestamp || ''}</div>
                <div><b>Summary:</b> {v.summary || ''}</div>
                <button onClick={() => handleRollback(idx)}>Rollback to version {idx + 1}</button>
                <button onClick={closeHistory} className={styles['nav-button']}>Close</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {calendarView && (
        <div aria-label={t('Calendar')} className={styles['calendar-view']}>
          <h2>{t('Event Calendar (Demo)')}</h2>
          <p>Calendar integration placeholder. Here you would see a calendar with event phases scheduled by date.</p>
        </div>
      )}
      <div ref={timelineRef} tabIndex={-1} aria-label="Timeline Editor">
        <EventTimelineEditor phases={phases} setPhases={setPhases} />
      </div>
      <section aria-label="Instructions" className={styles['instructions-section']}>
        <p>Drag and drop phases, set rewards, milestones, boss HP, shop bundles, banners, and difficulty tiers here.</p>
      </section>
    </div>
  );
}

export default EventComposer;
