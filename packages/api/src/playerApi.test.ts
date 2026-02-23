/* eslint-env jest */
import { getPlayer } from './playerApi';

describe('getPlayer', () => {
  it('should fetch player data successfully', async () => {
    // Mock API response
    const mockResponse = { id: 1, name: 'Test Player' };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as any);

    const result = await getPlayer(1);
    expect(result).toEqual(mockResponse);
  });

  it('should throw on API error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'error' }),
    } as any);
    await expect(getPlayer(1)).rejects.toThrow();
  });
});
