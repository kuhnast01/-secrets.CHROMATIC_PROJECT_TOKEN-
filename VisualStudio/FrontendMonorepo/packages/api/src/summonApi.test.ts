/* eslint-env jest */
import { getSummonBanners, summonOnBanner } from '@api';

describe('Summon API', () => {
  it('should fetch banners', async () => {
    const banners = await getSummonBanners();
    expect(Array.isArray(banners)).toBe(true);
    expect(banners.length).toBeGreaterThan(0);
    expect(banners[0]).toHaveProperty('id');
    expect(banners[0]).toHaveProperty('name');
  });

  it('should perform a summon and return units', async () => {
    const banners = await getSummonBanners();
    const result = await summonOnBanner(banners[0].id);
    expect(Array.isArray(result.units)).toBe(true);
    expect(result.units.length).toBeGreaterThan(0);
  });
});
