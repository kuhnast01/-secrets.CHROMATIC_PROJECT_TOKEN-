// Dynamic Offer Generation Module
// Best practices: modular, testable, config-driven, audit-ready

import { PlayerState } from './player-state-adapter';
import { LiveOpsEvent } from './liveops-trigger-adapter';
import { AuditLogger } from './audit-logger';

export interface OfferRule {
  id: string;
  name: string;
  eligibility: (player: PlayerState, event?: LiveOpsEvent) => boolean;
  offerDetails: (player: PlayerState, event?: LiveOpsEvent) => Offer;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  items: string[];
  expiresAt?: Date;
}

export class OfferEngine {
  private rules: OfferRule[];
  private auditLogger: AuditLogger;

  constructor(rules: OfferRule[], auditLogger: AuditLogger) {
    this.rules = rules;
    this.auditLogger = auditLogger;
  }

  generateOffers(player: PlayerState, event?: LiveOpsEvent): Offer[] {
    const offers: Offer[] = [];
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
