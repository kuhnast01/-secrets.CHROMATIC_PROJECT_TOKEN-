import { useQuery } from 'react-query';

// Example event API response shape
// id, name, type, description, keyArtUrl, endTime, rewards, entryScreen
export function useEvents() {
  return useQuery('events', async () => {
    // Replace with real API call
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    return await res.json();
  }, { staleTime: 60 * 1000 });
}
