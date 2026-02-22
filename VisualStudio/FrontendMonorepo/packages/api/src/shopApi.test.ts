/* eslint-env jest */
import { getShopItems, purchaseItem } from './shopApi';

describe('shopApi', () => {
  it('should fetch shop items', async () => {
    const mockResponse = [{ id: 1, name: 'Item' }];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as any);
    const result = await getShopItems();
    expect(result).toEqual(mockResponse);
  });
  it('should purchase an item', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ purchased: true }),
      ok: true,
    } as any);
    const result = await purchaseItem(1);
    expect(result.purchased).toBe(true);
  });
});
