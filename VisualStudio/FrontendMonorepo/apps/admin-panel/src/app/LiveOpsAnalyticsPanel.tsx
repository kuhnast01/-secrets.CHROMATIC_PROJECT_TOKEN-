"use client";
import React, { useEffect, useState } from 'react';
import { t } from './localization';
import './LiveOpsAnalyticsPanel.css';

import { apiFetch } from '../api';

async function fetchAnalytics(region = 'NA') {
  return apiFetch(`/analytics?region=${region}`);
}

const regions = [
  { code: 'NA', label: 'North America', currency: 'USD', locale: 'en-US' },
  { code: 'EU', label: 'Europe', currency: 'EUR', locale: 'de-DE' },
  { code: 'JP', label: 'Japan', currency: 'JPY', locale: 'ja-JP' },
  { code: 'BR', label: 'Brazil', currency: 'BRL', locale: 'pt-BR' },
];

  function handleExport(data: AnalyticsData | null, region: string) {
    if (!data) return;
    let csv = 'Event,Engagement,Revenue\n';
    data.eventPerformance.forEach((ev) => {
      csv += `${ev.name},${ev.engagement},${ev.revenue}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${region}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

type AnalyticsEvent = { name: string; engagement: number; revenue: number };
type AnalyticsData = {
  activeEvents: number;
  totalPlayers: number;
  engagedPlayers: number;
  revenue: number;
  eventPerformance: AnalyticsEvent[];
};

const LiveOpsAnalyticsPanel: React.FC = () => {
  const [region, setRegion] = useState<string>(regions[0].code);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndSetAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const d = await fetchAnalytics(region);
        setData(d);
        } catch {
          setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAndSetAnalytics();
  }, [region]);

  const regionMeta = regions.find(r => r.code === region) || regions[0];

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <h2 className="analytics-panel-title">{t('LiveOps Analytics')}</h2>
        <div className="analytics-panel-controls">
          <label htmlFor="region-select" className="analytics-panel-label">🌍</label>
          <select
            id="region-select"
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="analytics-panel-select"
          >
            {regions.map(r => (
              <option key={r.code} value={r.code}>{r.label}</option>
            ))}
          </select>
          <button
            onClick={() => handleExport(data, region)}
            className="analytics-panel-export-btn"
            disabled={!data || data.eventPerformance.length === 0}
            title={data && data.eventPerformance.length > 0 ? t('Export as CSV') : t('No data to export')}
          >
            {t('Export')}
          </button>
        </div>
      </div>
      {loading && <div className="analytics-panel-loading">{t('Loading analytics...')}</div>}
      {error && <div className="analytics-panel-error">{error}</div>}
      {!loading && !error && data && (
        <>
          <div className="analytics-panel-summary">
            <div><b>{t('Active Events')}:</b> {data.activeEvents}</div>
            <div><b>{t('Total Players')}:</b> {data.totalPlayers}</div>
            <div><b>{t('Engaged Players')}:</b> {data.engagedPlayers}</div>
            <div>
              <b>{t('Revenue')}:</b> {data.revenue.toLocaleString(regionMeta.locale, { style: 'currency', currency: regionMeta.currency })}
            </div>
          </div>
          <h3 className="analytics-panel-table-title">{t('Event Performance')}</h3>
          <table className="analytics-panel-table">
            <thead>
              <tr className="analytics-panel-table-header">
                <th className="analytics-panel-table-event">{t('Event')}</th>
                <th className="analytics-panel-table-engagement">{t('Engagement')}</th>
                <th className="analytics-panel-table-revenue">{t('Revenue')}</th>
              </tr>
            </thead>
            <tbody>
              {data.eventPerformance.length === 0 ? (
                <tr>
                  <td colSpan={3} className="analytics-panel-table-empty">{t('No event data available.')}</td>
                </tr>
              ) : (
                data.eventPerformance.map((ev: AnalyticsEvent) => (
                  <tr key={ev.name}>
                    <td className="analytics-panel-table-cell">{ev.name}</td>
                    <td className="analytics-panel-table-cell-right">{ev.engagement}</td>
                    <td className="analytics-panel-table-cell-right">{ev.revenue.toLocaleString(regionMeta.locale, { style: 'currency', currency: regionMeta.currency })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default LiveOpsAnalyticsPanel;
