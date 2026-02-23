// Poseidon API Rate Limiting and Abuse Prevention
// Professional, robust, and extensible

const rateLimits: Record<string, { count: number; last: number }> = {};
const LIMIT = 100;
const WINDOW = 60 * 1000; // 1 minute

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimits[userId] || { count: 0, last: now };
  if (now - entry.last > WINDOW) {
    entry.count = 0;
    entry.last = now;
  }
  entry.count++;
  rateLimits[userId] = entry;
  return entry.count <= LIMIT;
}

// Example usage:
// checkRateLimit('user1');
