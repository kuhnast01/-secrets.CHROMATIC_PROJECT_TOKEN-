/* eslint-env jest */
import { getSummonBanners, summonOnBanner } from '@api';

describe('Summon API battery test', () => {
  it('should perform 100 summons and never return an empty result', async () => {
    const banners = await getSummonBanners();
    const bannerId = banners[0].id;
    for (let i = 0; i < 100; i++) {
      const result = await summonOnBanner(bannerId);
      expect(Array.isArray(result.units)).toBe(true);
      expect(result.units.length).toBeGreaterThan(0);
    }
  });
});
