# Galaxy: Ascendant API Docs

This backend exposes a comprehensive REST API for all game features, including:
- Social: friends, chat, mail, referral, sharing
- LiveOps: events, world bosses, flash events
- PvP: ladders, guild wars, tournaments, spectator
- Monetization: login calendars, offers, ads
- Progression: daily streaks, idle rewards, collection milestones, narrative seasons
- Quality-of-life: cloud save, notifications, accessibility
- Content: campaign, achievements, lore
- Platform: cross-play, API, integrations

## How to Use
- **OpenAPI Spec:** See `openapi.full.yaml` for the complete machine-readable API definition (import into Swagger UI, Postman, etc.)
- **Swagger UI:** Use any Swagger UI tool to browse and test endpoints interactively.
- **Postman:** Import the OpenAPI spec for ready-to-use requests.
- **Static Docs:** Use Redoc or Swagger UI to generate a browsable HTML reference for your team.

## Example Endpoints
- `POST /calendar/claim` — Claim daily login reward
- `POST /season/progress` — Advance narrative season
- `POST /collection/add` — Add item to collection
- `POST /pvp/ladder/report` — Report PvP match
- `POST /guildwar/register` — Register a guild war
- `POST /cloudsave/save` — Save cloud data
- `POST /support/ticket` — Open support ticket
- `POST /config/update` — Update remote config
- `POST /eventfeed/push` — Push event feed
- `POST /localization/set` — Set localization string
- `GET /gdpr/export` — Export GDPR data

## For Designers/Frontend
- All endpoints are live and validated.
- Use the OpenAPI spec for request/response formats.
- Contact backend for any custom needs or new features.

---

*Generated automatically. For full endpoint list, see the OpenAPI spec or contact the backend team.*
