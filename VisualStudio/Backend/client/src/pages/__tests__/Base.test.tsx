import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Base from '../Base';

// simple fetch mock helper
function mockFetchSequence(responses: any[]) {
  let i = 0;
  vi.stubGlobal('fetch', vi.fn((url: any) => {
    const resp = responses[i++] || responses[responses.length - 1];
    return Promise.resolve({ json: () => Promise.resolve(resp) });
  }));
}

describe('Base page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('shows countdown immediately after upgrade (optimistic UI)', async () => {
    // initial responses for: getEconomyResources, getBuildings, getPlayer
    mockFetchSequence([
      { resources: { energy: 0, alloy: 0, credits: 10000, data: 0 }, produced: { energy: 0, alloy: 0, credits: 0, data: 0 } },
      { buildings: { 'Energy Reactor': { level: 1 } }, defs: { 'Energy Reactor': { baseProductionPerSec: 1, storageCap: 5000, upgradeCost: { credits: 200 }, upgradeTimeSec: 1 } } },
      { id: 'player-1' }
    ]);

    render(<Base />);

    // wait for the upgrade button to appear
    const upgradeBtn = await screen.findByRole('button', { name: /upgrade/i });
    expect(upgradeBtn).toBeInTheDocument();

    // prepare fetch to handle the POST /buildings/upgrade and subsequent refreshes
    vi.stubGlobal('fetch', vi.fn((url: any, opts: any) => {
      if (typeof url === 'string' && url.endsWith('/buildings/upgrade')) {
        return Promise.resolve({ json: () => Promise.resolve({ upgradeCompleteAt: Date.now() + 1500 }) });
      }
      // any other call return a buildings response with upgradeCompleteAt set
      if (typeof url === 'string' && url.endsWith('/economy/buildings')) {
        return Promise.resolve({ json: () => Promise.resolve({ buildings: { 'Energy Reactor': { level: 1, upgradeCompleteAt: Date.now() + 1500 } }, defs: { 'Energy Reactor': { upgradeTimeSec: 1 } } }) });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }));

    await userEvent.click(upgradeBtn);

    // after click, optimistic UI should display an 'Upgrading' countdown
    await waitFor(() => expect(screen.getByText(/upgrading/i)).toBeInTheDocument());
    const countdownText = screen.getByText(/completes in \d+s/i);
    expect(countdownText).toBeInTheDocument();
  });
});
