# API Testing for Beginners

1. Start your backend server (`pnpm run dev`).
2. Open your browser and go to `http://localhost:4000/api-docs` for interactive API docs (Swagger UI).
3. Use Swagger UI or a tool like Postman/Insomnia to test endpoints.
4. Read comments in each controller for guidance on what each endpoint does and what data it expects.

## License Admin Route Checks

- Use an admin JWT for mutation endpoints under `/license/*`.
- Confirm mutation responses include `audit.actorId`, `audit.actorRole`, and `audit.timestamp`.
	Validate revocation lifecycle sequence:
	1. `POST /license/revocations`
	2. `GET /license/revocations`
	3. `DELETE /license/revocations/:keyHash`
	Validate rotation behavior:
		- `POST /license/tools/rotate` with default behavior should revoke previous key.
		- `POST /license/tools/rotate` with `revokePrevious=false` should keep previous key valid.

Automated check for the above contract:

- `pnpm --dir backend exec jest src/routes/license.test.ts`
