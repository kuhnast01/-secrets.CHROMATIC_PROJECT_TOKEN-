# Dynamic Offer Generation System

## Overview
This module generates personalized offers for players based on their state and LiveOps triggers, with full audit logging for compliance and analytics.

## Components
- **OfferEngine**: Core logic for generating offers.
- **OfferRule**: Configurable rules for eligibility and offer details.
- **PlayerStateAdapter**: Fetches player state.
- **LiveOpsTriggerAdapter**: Processes LiveOps events.
- **AuditLogger**: Logs offer generation events.

## Usage Example
```typescript
import { OfferEngine } from './offer-engine';
import { fetchPlayerState } from './player-state-adapter';
import { listenForLiveOpsEvents } from './liveops-trigger-adapter';
import { AuditLogger } from './audit-logger';

const rules = [/* ...define OfferRule objects... */];
const auditLogger = new AuditLogger();
const engine = new OfferEngine(rules, auditLogger);

fetchPlayerState('player123').then(playerState => {
  listenForLiveOpsEvents(event => {
    const offers = engine.generateOffers(playerState, event);
    // Display or deliver offers to player
  });
});
```

## Testing
- Unit tests should cover:
  - Offer eligibility logic
  - Offer generation for various player states and events
  - Audit log entries
- Integration tests should simulate LiveOps events and player state changes.

## Best Practices
- Keep rules modular and config-driven
- Ensure audit logs are append-only and structured
- Use adapters for easy integration with real data sources and event systems

## Compliance
- All offer generations are logged for traceability
- Admin overrides and manual triggers are supported

---
For further details, see the source files in backend/src/poseidon/.
