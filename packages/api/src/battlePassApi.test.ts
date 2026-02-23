/* eslint-env jest */
import { getBattlePass, upgradeBattlePass, claimBattlePassTier } from './battlePassApi';

describe('battlePassApi', () => {
  it('should fetch battle pass data', async () => {
    // Mock API response
    const mockResponse = { id: 1, tiers: [] };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as any);
    const result = await getBattlePass(1);
    expect(result).toEqual(mockResponse);
  });
  it('should upgrade battle pass', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ success: true }),
      ok: true,
    } as any);
    const result = await upgradeBattlePass(1);
    expect(result.success).toBe(true);
  });
  it('should claim a battle pass tier', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ claimed: true }),
      ok: true,
    } as any);
    const result = await claimBattlePassTier(1, 2);
    expect(result.claimed).toBe(true);
  });
});
