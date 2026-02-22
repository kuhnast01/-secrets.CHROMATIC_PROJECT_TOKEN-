// Dynamic Offer Generation Module
// Best practices: modular, testable, config-driven, audit-ready
export class OfferEngine {
    constructor(rules, auditLogger) {
        this.rules = rules;
        this.auditLogger = auditLogger;
    }
    generateOffers(player, event) {
        const offers = [];
        for (const rule of this.rules) {
            if (rule.eligibility(player, event)) {
                const offer = rule.offerDetails(player, event);
                offers.push(offer);
                this.auditLogger.logOfferGenerated(player.id, offer, rule.id, event);
            }
        }
        return offers;
    }
}
// Example usage:
// const engine = new OfferEngine(rules, auditLogger);
// const offers = engine.generateOffers(playerState, liveOpsEvent);
