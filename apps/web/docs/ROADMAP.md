# Roadmap

## v1.1 — Production Readiness
- [ ] Replace local file storage with S3-compatible object storage (e.g. MinIO, AWS S3)
- [ ] Add email notifications (request submitted, claimed, scheduled, completed)
- [ ] Add optimistic concurrency / DB transactions for capacity enforcement
- [ ] Dockerfile and production build pipeline

## v1.2 — Enhanced UX
- [ ] Real-time status updates via Server-Sent Events or WebSockets
- [ ] Photo gallery viewer on request detail page
- [ ] Pagination on the requests list (currently loads all)
- [ ] Citizen notification preferences (email / SMS)

## v1.3 — Volunteer Tools
- [ ] Volunteer profile with skills/specialties
- [ ] Request filtering by volunteer's skills
- [ ] Print schedule sheet for events (PDF export)
- [ ] Event check-in QR codes

## v1.4 — Admin Panel
- [ ] Admin role with full oversight
- [ ] User management (promote to volunteer, deactivate)
- [ ] Analytics dashboard: repair success rate, categories, events over time
- [ ] Bulk status updates

## v2.0 — Multi-tenancy
- [ ] Support multiple Repair Café organisations
- [ ] Organisation-scoped events and requests
- [ ] Public event calendar (no login required to browse events)
- [ ] Waitlist for full events

## Technical Debt
- [ ] Add E2E tests (Playwright)
- [ ] Add integration tests with a real test database (Docker in CI)
- [ ] Add error boundary components for graceful UI error handling
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection review for server actions
