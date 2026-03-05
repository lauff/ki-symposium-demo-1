# Architecture

## Overview

Repair Café is a full-stack Next.js 14 web application that connects citizens needing repairs with skilled volunteers at community repair events.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Authentication | Auth.js v5 (next-auth@beta) — JWT strategy |
| Styling | Tailwind CSS |
| Testing | Vitest + Testing Library |
| Container | Docker Compose |

## Directory Structure

```
ki-symposium-demo-1/
├── apps/
│   └── web/                     # Next.js application
│       ├── app/                 # App Router pages
│       │   ├── (auth)/          # Login / Register (route group)
│       │   ├── (citizen)/       # Citizen-only pages
│       │   ├── (volunteer)/     # Volunteer-only pages
│       │   ├── api/auth/        # Auth.js API route
│       │   ├── layout.tsx       # Root layout with nav
│       │   └── page.tsx         # Public home page
│       ├── lib/
│       │   ├── auth.ts          # Auth.js configuration
│       │   ├── db.ts            # Prisma client singleton
│       │   ├── actions/         # Server Actions
│       │   ├── domain/          # Pure domain logic (no DB)
│       │   └── services/        # DB service layer
│       ├── middleware.ts        # Route protection
│       ├── prisma/
│       │   ├── schema.prisma    # Database schema
│       │   └── seed.ts          # Demo seed data
│       ├── tests/
│       │   ├── domain/          # Pure unit tests
│       │   └── integration/     # Service-level tests (DB mocked)
│       └── types/               # TypeScript type augmentation
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Data Flow

```
Browser → Next.js Server Component → Service → Prisma → PostgreSQL
Browser → "use client" Component → Server Action → Service → Prisma → PostgreSQL
```

## Authentication Flow

1. User submits credentials via login form
2. `next-auth` Credentials provider calls `bcrypt.compare`
3. JWT token is created with `id` and `role`
4. Middleware reads JWT from cookie and enforces role-based routing
5. Server components call `auth()` to get session

## Route Protection

The `middleware.ts` intercepts all `/citizen/*` and `/volunteer/*` routes:
- Unauthenticated users → redirect to `/login`
- Wrong role → redirect to their own dashboard
