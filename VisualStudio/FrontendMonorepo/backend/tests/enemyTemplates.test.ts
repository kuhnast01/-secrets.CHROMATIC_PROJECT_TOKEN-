import request from 'supertest';
import app from '../src/index';

describe('Enemy Templates API', () => {
  describe('GET /api/enemy-templates', () => {
    it('should return all enemy templates from the database', async () => {
      const res = await request(app).get('/api/enemy-templates');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Optionally check for at least one known template
      expect(res.body.some((t: any) => t.id === 'ENM_101')).toBe(true);
    });
  });

  describe('GET /api/enemy-templates/:id', () => {
    it('should return a single enemy template by id (from DB or static)', async () => {
      const res = await request(app).get('/api/enemy-templates/ENM_101');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'ENM_101');
    });

    it('should return 404 for a non-existent template', async () => {
      const res = await request(app).get('/api/enemy-templates/DOES_NOT_EXIST');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Validation', () => {
    it('should validate scaling for ship levels by sector', async () => {
      const res = await request(app).get('/api/enemy-templates/ENM_101');
      expect(res.status).toBe(200);
      expect(res.body.fleet.every((ship: any) => ship.level === 1)).toBe(true);
      const res2 = await request(app).get('/api/enemy-templates/ENM_201');
      expect(res2.status).toBe(200);
      expect(res2.body.fleet.every((ship: any) => ship.level === 2)).toBe(true);
    });

    it('should validate boss abilities are present for boss templates', async () => {
      const bossRes = await request(app).get('/api/enemy-templates/ENM_108');
      expect(bossRes.status).toBe(200);
      expect(bossRes.body).toHaveProperty('bossAbility');
      const bossRes2 = await request(app).get('/api/enemy-templates/ENM_208');
      expect(bossRes2.status).toBe(200);
      expect(bossRes2.body).toHaveProperty('bossAbility');
    });

    it('should validate anomaly effects for anomaly templates', async () => {
      const anomalyRes = await request(app).get('/api/enemy-templates/ENM_107');
      expect(anomalyRes.status).toBe(200);
      expect(anomalyRes.body).toHaveProperty('anomaly');
      const anomalyRes2 = await request(app).get('/api/enemy-templates/ENM_207');
      expect(anomalyRes2.status).toBe(200);
      expect(anomalyRes2.body).toHaveProperty('anomaly');
    });
  });

  describe('Custom Faction and Ability Logic', () => {
    it('should support custom faction traits and abilities', async () => {
      const customRes = await request(app).get('/api/enemy-templates/ENM_CUSTOM');
      expect(customRes.status).toBe(200);
      expect(customRes.body).toHaveProperty('customTraits');
      expect(customRes.body).toHaveProperty('specialAbilities');
    });
  });
});
