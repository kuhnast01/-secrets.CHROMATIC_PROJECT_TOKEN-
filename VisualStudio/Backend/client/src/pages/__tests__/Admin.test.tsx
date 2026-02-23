import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Admin from '../Admin';

const fakeMetrics = { ticksRun: 3, playersProcessed: 2, errors: 0, lastRunTs: Date.now() };
const fakeEvents = [{ id: 'e1', type: 'tick.run', ts: Date.now(), payload: { ticksRun: 3 } }];

vi.stubGlobal('fetch', vi.fn((url: string, opts?: any) => {
  if (url.endsWith('/admin/tick/metrics')) return Promise.resolve({ json: () => Promise.resolve({ metrics: fakeMetrics }) });
  if (url.endsWith('/admin/tick/trigger')) return Promise.resolve({ json: () => Promise.resolve({ ok: true }) });
  if (url.includes('/admin/analytics')) return Promise.resolve({ json: () => Promise.resolve({ events: fakeEvents }) });
  return Promise.resolve({ json: () => Promise.resolve({}) });
}));

describe('Admin page', () => {
  test('renders metrics and events and allows trigger', async () => {
    render(<Admin />);
    await waitFor(() => expect(screen.getByText(/Ticks run/)).toBeInTheDocument());
    expect(screen.getByText(/Players processed/)).toBeInTheDocument();
    expect(screen.getByText(/tick.run/)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Trigger Tick/i });
    await userEvent.click(btn);
    await waitFor(() => expect(screen.getByText(/Ticks run/)).toBeInTheDocument());
  });
});
