// Poseidon Analytics Visualization and Export
// Professional, robust, and extensible

import fs from 'fs/promises';
import { RealTimeAnalytics } from './real-time-monitoring';

export async function exportAnalyticsToCSV(analytics: RealTimeAnalytics, filePath: string) {
  const data = analytics.getRecent();
  const csv = ['type,payload,timestamp'];
  for (const dp of data) {
    csv.push(`${dp.type},"${JSON.stringify(dp.payload)}",${dp.timestamp}`);
  }
  await fs.writeFile(filePath, csv.join('\n'), 'utf-8');
}

export function visualizeAnalytics(analytics: RealTimeAnalytics, type?: string) {
  const data = analytics.getRecent(type);
  // Simple visualization: histogram by type
  const histogram: Record<string, number> = {};
  for (const dp of data) {
    histogram[dp.type] = (histogram[dp.type] || 0) + 1;
  }
  return histogram;
}

// Example usage:
// exportAnalyticsToCSV(analytics, './analytics.csv');
// console.log(visualizeAnalytics(analytics));
