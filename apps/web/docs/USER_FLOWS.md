# User Flows

## Citizen Flow

### Register and Submit a Request
1. Visit `/` (home page)
2. Click "Submit a Repair Request" → `/register`
3. Fill in name, email, password, select "Citizen"
4. After registration → redirect to `/citizen/requests`
5. Click "+ New Request"
6. Fill title, category, description; optionally upload photos
7. Submit → request created with status SUBMITTED
8. Redirected back to requests list

### View Request Status
1. Go to `/citizen/requests`
2. See all own requests with colour-coded status badges
3. Click a request to see details, assigned volunteer, scheduled event, and notes

### Cancel a Request
1. Open a request with status SUBMITTED or REVIEWED
2. Click "Cancel Request"
3. Status changes to CANCELLED

---

## Volunteer Flow

### Dashboard Overview
1. Login with volunteer credentials
2. Redirect to `/volunteer/dashboard`
3. See KPI cards: total, submitted, in-repair, repaired
4. See status breakdown chart and next upcoming event

### Process a Request
1. Go to `/volunteer/requests`
2. Use filter bar to filter by status or category
3. Click "Claim" on an unclaimed request
4. Open request detail via "View →"
5. Schedule to an event (dropdown shows available events with remaining capacity)
6. Advance status: REVIEWED → SCHEDULED → IN_REPAIR → REPAIRED
7. Add notes as needed

### Create and Manage Events
1. Go to `/volunteer/events`
2. Click "+ New Event"
3. Fill title, location, start/end datetime, capacity
4. Created event appears in list
5. Click "View / Edit" to update details or see scheduled requests
6. Delete event only if no requests are scheduled

---

## Public Home Page

- Displays upcoming events (next 3) with capacity indicators
- "How It Works" section explaining the 3-step process
- CTA buttons for Register and Login
- Works gracefully when database is not connected (empty state)
