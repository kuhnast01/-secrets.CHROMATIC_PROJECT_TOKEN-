import { describe, it, expect } from 'vitest';

// Example of an advanced unit test

describe('Math utilities', () => {
  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });
});

// Example of an integration test

describe('API integration', () => {
  it('should fetch data from a mock endpoint', async () => {
    global.fetch = async () => ({ json: async () => ({ result: 'ok' }) }) as any;
    const response = await fetch('/api/test');
    const data = await response.json();
    expect(data.result).toBe('ok');
  });
});
