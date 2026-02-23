export class AuditLogger {
    logOfferGenerated(playerId, offer, ruleId, event) {
        // Append-only log, structured for compliance and analytics
        const logEntry = {
            timestamp: new Date().toISOString(),
            playerId,
            offerId: offer.id,
            ruleId,
            eventType: event?.type || null,
            eventId: event?.id || null,
            offerDetails: offer,
        };
        // TODO: Replace with persistent log (DB, file, etc.)
        console.log('[AUDIT OFFER GENERATED]', JSON.stringify(logEntry));
    }
}
