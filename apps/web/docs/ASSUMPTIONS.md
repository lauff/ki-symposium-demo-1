# Assumptions & Design Decisions

## Authentication
- **JWT strategy** chosen over database sessions to avoid an extra table and reduce DB round-trips on every request.
- **Credentials-only** provider (email + password) for simplicity. OAuth providers (Google, GitHub) can be added via Auth.js without schema changes.
- Password hashing uses **bcrypt with salt rounds = 12** — a good balance of security and performance.

## Roles
- Two roles only: CITIZEN and VOLUNTEER. Admin roles are out of scope for this demo.
- Role is stored in the JWT so that middleware can enforce routing without a DB call.

## File Uploads
- Photos are saved to the **local filesystem** (`public/uploads/`). This is suitable for development and single-instance deployments.
- For production, replace `upload.service.ts` with an S3/object-storage adapter.

## Status Transitions
- Status can only move **forward** (no rollback). Volunteers can only advance, not retreat.
- CANCEL is only available to citizens and only before the item is scheduled (SUBMITTED, REVIEWED).
- IN_REPAIR requires a scheduled event — this prevents orphaned "in-repair" items.

## Capacity
- Capacity is checked at schedule time via a DB count query. There is no pessimistic locking; concurrent requests could theoretically exceed capacity under high load (race condition). For production, a DB transaction with `SELECT FOR UPDATE` or optimistic concurrency should be used.

## Data Seeding
- Seed creates two demo users and five requests in various states for easy demo/development.
- Seed uses `upsert` for users so it is safe to re-run.

## shadcn/ui
- `components.json` is configured but shadcn components were not pulled (requires internet access at install time). The UI uses raw Tailwind CSS classes, which are equivalent in appearance.

## Testing
- Domain logic (pure functions) is tested with unit tests — no mocking required.
- Service layer is tested with Vitest mocking the Prisma DB client.
- No E2E tests are included in this version; Playwright would be the recommended next step.
