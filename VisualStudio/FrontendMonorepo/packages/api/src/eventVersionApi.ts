// eventVersionApi.ts
// Simple mock API for event version history persistence

import type { EventVersion } from 'models/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}



// Persist to backend API
export function saveEventVersion(version: EventVersion) {
  return apiFetch('/event-versions', {
    method: 'POST',
    body: JSON.stringify(version),
  });
}

export async function getEventVersions(limit = 50): Promise<EventVersion[]> {
  try {
    return await apiFetch(`/event-versions?limit=${limit}`);
  } catch {
    return [];
  }
}

export function clearEventVersions() {
  // Optionally implement backend endpoint to clear versions
  return apiFetch('/event-versions', { method: 'DELETE' });
}

// TODO: Replace with real database or backend API
