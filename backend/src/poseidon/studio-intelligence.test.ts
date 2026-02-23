import 'jest';
// Phase 3 Pillar 3: Studio-Wide Intelligence Layer tests for Poseidon
import { StudioIntelligence, AnalyticsEvent } from './studio-intelligence';

describe('StudioIntelligence', () => {
  let intelligence: StudioIntelligence;
  const now = Date.now();

  beforeEach(() => {
    intelligence = new StudioIntelligence();
  });

  it('should predict retention risk or healthy', () => {
    for (let i = 0; i < 5; i++) {
      intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    }
    expect(intelligence.retentionPrediction()).toBe('Retention risk');
    for (let i = 0; i < 6; i++) {
      intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    }
    expect(intelligence.retentionPrediction()).toBe('Retention healthy');
  });

  it('should detect monetization anomaly', () => {
    expect(intelligence.monetizationAnomaly()).toBe('Monetization anomaly detected');
    intelligence.ingestEvent({ type: 'purchase', value: 5, timestamp: now });
    intelligence.ingestEvent({ type: 'purchase', value: 10, timestamp: now });
    expect(intelligence.monetizationAnomaly()).toBe('Monetization normal');
  });

  it('should cluster crashes', () => {
    expect(intelligence.clusterCrashes().clusters).toBe(0);
    intelligence.ingestEvent({ type: 'crash', value: 1, timestamp: now });
    expect(intelligence.clusterCrashes().clusters).toBe(1);
  });

  it('should analyze performance trend', () => {
    expect(intelligence.performanceTrend()).toBe('No performance data');
    intelligence.ingestEvent({ type: 'fps', value: 60, timestamp: now });
    expect(intelligence.performanceTrend()).toBe('Performance data available');
  });

  it('should recommend improvements', () => {
    expect(intelligence.recommendImprovements()).toContain('Improve onboarding');
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    intelligence.ingestEvent({ type: 'session', value: 1, timestamp: now });
    expect(intelligence.recommendImprovements()).toContain('Review IAP flow');
  });
});
