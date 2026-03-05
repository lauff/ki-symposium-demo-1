# Domain Model

## Entities

### User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| name | String | Required |
| email | String | Unique |
| password | String | Bcrypt hashed |
| phone | String? | Optional |
| role | CITIZEN \| VOLUNTEER | Default: CITIZEN |

### RepairRequest
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| title | String | |
| category | RepairCategory | See enum |
| description | String | |
| photos | String[] | File URLs |
| status | RepairStatus | Default: SUBMITTED |
| notes | String? | Volunteer notes |
| createdByUserId | UUID | FK → User |
| claimedByVolunteerId | UUID? | FK → User (volunteer) |
| scheduledEventId | UUID? | FK → RepairEvent |

### RepairEvent
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| title | String | |
| location | String | |
| startAt | DateTime | |
| endAt | DateTime | |
| capacity | Int | Max scheduled items |
| volunteerOwnerId | UUID | FK → User (volunteer) |

## Enums

### RepairCategory
`ELECTRONICS` | `SMALL_APPLIANCE` | `TEXTILE` | `BIKE` | `WOOD` | `OTHER`

### RepairStatus
`SUBMITTED` → `REVIEWED` → `SCHEDULED` → `IN_REPAIR` → `REPAIRED` | `NOT_REPAIRABLE`

Can cancel from `SUBMITTED` or `REVIEWED` → `CANCELLED`

## Business Rules

1. **Citizen actions**: create request, view own requests, cancel (only if SUBMITTED or REVIEWED)
2. **Volunteer actions**: claim/unclaim, schedule to event, advance status, add notes
3. **Status transitions** (forward only):
   - SUBMITTED → REVIEWED
   - REVIEWED → SCHEDULED
   - SCHEDULED → IN_REPAIR
   - IN_REPAIR → REPAIRED or NOT_REPAIRABLE
4. **Capacity**: Cannot schedule more items than event capacity
5. **IN_REPAIR constraint**: Requires a scheduled event
6. **Cancellation**: Only citizens can cancel; only before scheduling

## Status State Machine

```
SUBMITTED ──► REVIEWED ──► SCHEDULED ──► IN_REPAIR ──► REPAIRED
    │              │                                  └──► NOT_REPAIRABLE
    └──────────────└──────────────────────────────────────► CANCELLED
```
