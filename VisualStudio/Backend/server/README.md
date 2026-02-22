# Galaxy: Ascendant — Backend (MVP scaffold)

This is a minimal Node.js + TypeScript scaffold for the Galaxy: Ascendant MVP.

Run locally:
- npm install
- npm run dev

Optional MongoDB persistence:
- Copy `.env.example` → `.env` and set `MONGO_URL` when you want data to persist across restarts.
- To run Mongo locally (Docker):
  `docker run -p 27017:27017 -d --name galaxy-mongo mongo:6.0`
- After setting `MONGO_URL`, the server will persist `players` and `fleets` to MongoDB.

Includes: Express routes for auth, player, economy, fleet, combat and static-data; Docker Compose for local Mongo/Postgres/Redis; OpenAPI stub and a basic test.
