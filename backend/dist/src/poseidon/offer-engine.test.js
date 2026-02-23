import { OfferEngine } from './offer-engine';
import { fetchPlayerState } from './player-state-adapter';
import { AuditLogger } from './audit-logger';
describe('OfferEngine', () => {
    it('should generate offers for eligible player', async () => {
        const rule = {
            id: 'rule1',
            name: 'VIP Offer',
            eligibility: (player) => player.profile.segment === 'VIP',
            offerDetails: (player) => ({
                id: 'offer1',
                title: 'VIP Special',
                description: 'Exclusive offer for VIPs',
                price: 4.99,
                items: ['gold', 'diamond'],
            }),
        };
        const auditLogger = new AuditLogger();
        const engine = new OfferEngine([rule], auditLogger);
        const playerState = await fetchPlayerState('player123');
        const offers = engine.generateOffers(playerState);
        expect(offers.length).toBeGreaterThan(0);
        expect(offers[0].title).toBe('VIP Special');
    });
    it('should not generate offers for ineligible player', async () => {
        const rule = {
            id: 'rule2',
            name: 'Non-VIP Offer',
            eligibility: (player) => player.profile.segment === 'Regular',
            offerDetails: (player) => ({
                id: 'offer2',
                title: 'Regular Offer',
                description: 'Offer for regular players',
                price: 1.99,
                items: ['silver'],
            }),
        };
        const auditLogger = new AuditLogger();
        const engine = new OfferEngine([rule], auditLogger);
        const playerState = await fetchPlayerState('player123');
        const offers = engine.generateOffers(playerState);
        expect(offers.length).toBe(0);
    });
});
