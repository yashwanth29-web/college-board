# Events App

This Django app manages college events and student registrations.

## Models

### Event
- **Fields**: title, description, date, time, location, capacity, current_registrations, created_by, is_active
- **Indexes**: (date, time), (is_active, date)
- **Property**: is_full - returns True when current_registrations >= capacity

### EventRegistration
- **Fields**: student (FK), event (FK), registered_at
- **Constraints**: unique_together on (student, event)
- **Indexes**: (student, event), (event, registered_at)

## API Endpoints

### GET /api/events
List all active events, ordered by date ascending (paginated)
- **Authentication**: Required
- **Permissions**: Any authenticated user

### POST /api/events
Create a new event
- **Authentication**: Required
- **Permissions**: Admin only
- **Request Body**:
```json
{
  "title": "Tech Fest 2024",
  "description": "Annual technology festival",
  "date": "2024-02-20",
  "time": "09:00:00",
  "location": "Main Auditorium",
  "capacity": 500
}
```

### POST /api/events/{id}/register
Register current student for an event
- **Authentication**: Required
- **Permissions**: Students only
- **Validations**:
  - Event must not be full (is_full check)
  - Student cannot register twice for same event
  - Atomically increments current_registrations counter

### GET /api/events/my-events
Get events the current student is registered for
- **Authentication**: Required
- **Permissions**: Students only
- **Returns**: List of events with registration details

### GET /api/events/{id}/registrations
Get list of students registered for an event
- **Authentication**: Required
- **Permissions**: Admin only
- **Returns**: Event details and list of registrations with student info

## Features

- **Capacity Management**: Automatic validation prevents over-registration
- **Atomic Operations**: Registration and counter increment happen atomically
- **Duplicate Prevention**: Unique constraint prevents double registration
- **Efficient Queries**: Uses select_related for optimized database queries
- **Proper Indexing**: Database indexes on frequently queried fields
