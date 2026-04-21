# Analytics App

This app provides analytics endpoints for administrators to view statistics and metrics about the college portal.

## Endpoints

### GET /api/analytics/overview
Get dashboard overview statistics (Admin only)

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_students": 1250,
    "total_events": 45,
    "total_announcements": 128,
    "total_tickets": 89,
    "open_tickets": 23,
    "active_events": 12
  }
}
```

### GET /api/analytics/participation
Get event participation statistics (Admin only)

**Query Parameters:**
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "total_registrations": 1450,
    "events": [
      {
        "event_id": 1,
        "event_title": "Tech Fest 2024",
        "registrations": 234,
        "capacity": 500,
        "fill_rate": 46.8
      }
    ],
    "registrations_over_time": [
      {
        "date": "2024-01-15",
        "count": 45
      }
    ]
  }
}
```

### GET /api/analytics/tickets
Get ticket resolution metrics (Admin only)

**Query Parameters:**
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_tickets": 89,
    "status_distribution": {
      "open": 23,
      "in_progress": 15,
      "resolved": 45,
      "closed": 6
    },
    "average_resolution_time_hours": 18.5,
    "category_breakdown": {
      "technical": 34,
      "academic": 28,
      "administrative": 20,
      "other": 7
    }
  }
}
```

## Permissions

All analytics endpoints require admin authentication (IsAdminUser permission).

## Requirements Validated

- 8.1: Overview endpoint shows total counts
- 8.2: Participation endpoint returns event registration statistics
- 8.3: Registrations over time data grouped by date
- 8.4: Ticket resolution metrics with average resolution time
- 8.5: Ticket status distribution
- 8.6: Date range filtering with start_date and end_date parameters
