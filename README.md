# 🔧 Repair Café

A community web application that connects citizens needing repairs with skilled volunteers at organised repair events.

## Features

- **Citizens** can submit repair requests (with photos), track status, and cancel pending requests
- **Volunteers** can browse all requests, claim them, schedule to events, advance repair status, and add notes
- **Repair Events** with capacity management — volunteers create events and schedule items
- **Role-based access** — citizens and volunteers have separate dashboards
- **Auth** — email/password authentication with JWT sessions (Auth.js v5)

## Quick Start

### Prerequisites
- Node.js 20+
- Docker (for PostgreSQL)

### Setup

```bash
# 1. Start the database
make db-up

# 2. Install dependencies
make install

# 3. Set up environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local and set DATABASE_URL, NEXTAUTH_SECRET

# 4. Run migrations and seed demo data
make migrate
make seed

# 5. Start the dev server
make dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@repair.cafe | password123 |
| Volunteer | volunteer@repair.cafe | password123 |

## Tech Stack

- **Next.js 14** — App Router, Server Components, Server Actions
- **TypeScript**
- **PostgreSQL + Prisma 5** — database and ORM
- **Auth.js v5** — JWT authentication with Credentials provider
- **Tailwind CSS** — utility-first styling
- **Vitest** — unit and integration tests
- **Docker Compose** — local development database

## Project Structure

```
apps/web/
├── app/           # Next.js pages (App Router)
├── lib/
│   ├── auth.ts    # Auth.js configuration
│   ├── db.ts      # Prisma client singleton
│   ├── actions/   # Server Actions (mutations)
│   ├── domain/    # Pure domain logic
│   └── services/  # Database service layer
├── prisma/        # Schema + seed
├── tests/         # Unit and integration tests
└── docs/          # Documentation
```

## Available Commands

```bash
make dev          # Start development server
make test         # Run tests
make build        # Production build
make db-up        # Start PostgreSQL in Docker
make migrate      # Run Prisma migrations
make seed         # Seed demo data
make studio       # Open Prisma Studio
make generate     # Regenerate Prisma client
```

## Documentation

- [Architecture](apps/web/docs/ARCHITECTURE.md)
- [Domain Model](apps/web/docs/DOMAIN_MODEL.md)
- [API Reference](apps/web/docs/API.md)
- [User Flows](apps/web/docs/USER_FLOWS.md)
- [Assumptions](apps/web/docs/ASSUMPTIONS.md)
- [Roadmap](apps/web/docs/ROADMAP.md)
