# Store Item Schema

Each store item is defined in JSON for easy catalog management and LiveOps integration.

## Example Store Item

```
{
  "id": "BUNDLE_STARTER_01",
  "type": "bundle",
  "pricePremium": 499,
  "contents": {
    "premiumCurrency": 500,
    "resources": { "energy": 10000, "alloy": 5000 },
    "commanderShards": { "CMD_001": 20 }
  },
  "visibility": {
    "minSector": 1,
    "maxSector": 3,
    "oneTimePurchase": true
  }
}
```

## Fields
- `id`: Unique item identifier
- `type`: bundle, resource_pack, speedup, cosmetic, dynamic_offer
- `priceSoft`: Cost in soft currency (optional)
- `pricePremium`: Cost in premium currency (optional)
- `contents`: What the player receives
- `visibility`: Rules for showing item (sector, one-time, triggers)

## Dynamic Offers
- Use `trigger` in visibility for milestone, returning, or stuck player offers.

## Safety
- All purchases validated server-side, no client authority.
- Transaction logs for audit/support.

## Example Dynamic Offer
```
{
  "id": "RETURNING_PLAYER_OFFER_01",
  "type": "dynamic_offer",
  "pricePremium": 99,
  "contents": {
    "premiumCurrency": 100,
    "resources": { "energy": 5000, "alloy": 2000 }
  },
  "visibility": {
    "minSector": 1,
    "maxSector": 99,
    "oneTimePurchase": true,
    "trigger": "returning_player"
  }
}
```
