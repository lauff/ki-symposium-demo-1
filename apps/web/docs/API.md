# API Reference

This application uses Next.js Server Actions for mutations and Server Components for data fetching. The only traditional REST endpoint is the Auth.js handler.

## Auth Endpoint

### `GET/POST /api/auth/[...nextauth]`
Handled by Auth.js. Provides:
- `GET /api/auth/session` — returns current session
- `POST /api/auth/signin/credentials` — sign in
- `POST /api/auth/signout` — sign out

## Server Actions

### Auth Actions (`lib/actions/auth.actions.ts`)

#### `registerAction(formData: FormData)`
Creates a new user account and signs them in.

**FormData fields:**
- `name` (string, min 2)
- `email` (string, email)
- `password` (string, min 6)
- `phone` (string, optional)
- `role` ("CITIZEN" | "VOLUNTEER", default "CITIZEN")

**Returns:** `{ success: true }` or `{ error: string }`

#### `loginAction(formData: FormData)`
Signs in an existing user.

**FormData fields:** `email`, `password`

**Returns:** `{ success: true }` or `{ error: string }`

### Repair Request Actions (`lib/actions/repair-request.actions.ts`)

#### `createRequestAction(formData: FormData)`
Creates a new repair request. Requires CITIZEN session. Redirects to `/citizen/requests` on success.

#### `cancelRequestAction(id: string)`
Cancels a repair request. Only works for SUBMITTED/REVIEWED status.

#### `claimRequestAction(id: string)`
Volunteer claims a repair request.

#### `unclaimRequestAction(id: string)`
Volunteer unclaims their repair request.

#### `scheduleRequestAction(id: string, eventId: string)`
Schedules a request to an event (checks capacity).

#### `updateStatusAction(id: string, newStatus: RepairStatus)`
Advances the request status (validates transition).

#### `updateNotesAction(id: string, notes: string)`
Updates volunteer notes on a request.

### Repair Event Actions (`lib/actions/repair-event.actions.ts`)

#### `createEventAction(formData: FormData)`
Creates a repair event. Requires VOLUNTEER session. Redirects on success.

#### `updateEventAction(id: string, formData: FormData)`
Updates event details. Cannot reduce capacity below scheduled count.

#### `deleteEventAction(id: string)`
Deletes an event. Fails if any requests are scheduled.
