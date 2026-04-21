# Tickets App

Support ticket system for students to raise issues and administrators to manage them.

## Features

- Students can create support tickets
- Role-based filtering (students see only their tickets, admins see all)
- Status tracking: open, in_progress, resolved, closed
- Category classification: technical, academic, administrative, other
- Admin assignment and status updates
- Database indexes for optimal query performance

## Models

### Ticket
- `subject`: Ticket title (max 255 chars)
- `description`: Detailed description
- `category`: One of technical, academic, administrative, other
- `status`: One of open, in_progress, resolved, closed (default: open)
- `student`: Foreign key to Student (who created the ticket)
- `assigned_to`: Foreign key to User (admin assigned to handle)
- `created_at`: Auto timestamp on creation
- `updated_at`: Auto timestamp on update
- `resolved_at`: Timestamp when ticket was resolved

## API Endpoints

### GET /api/tickets
List tickets with role-based filtering
- Students: See only their own tickets
- Admins: See all tickets
- Query params: `status` (optional) - filter by status

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 5,
    "results": [
      {
        "id": 1,
        "subject": "Login Issue",
        "description": "Cannot access my account",
        "category": "technical",
        "status": "open",
        "student": {
          "id": 1,
          "name": "John Doe",
          "student_id": "STU2024001",
          "email": "john.doe@college.edu"
        },
        "assigned_to": null,
        "created_at": "2024-01-15T09:00:00Z",
        "updated_at": "2024-01-15T09:00:00Z",
        "resolved_at": null
      }
    ]
  }
}
```

### POST /api/tickets
Create a new ticket (Student only)

**Request:**
```json
{
  "subject": "Library Access Problem",
  "description": "My library card is not working",
  "category": "administrative"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Ticket created successfully",
  "data": {
    "id": 2,
    "subject": "Library Access Problem",
    "description": "My library card is not working",
    "category": "administrative",
    "status": "open",
    "student": {
      "id": 1,
      "name": "John Doe",
      "student_id": "STU2024001",
      "email": "john.doe@college.edu"
    },
    "assigned_to": null,
    "created_at": "2024-01-16T10:30:00Z",
    "updated_at": "2024-01-16T10:30:00Z",
    "resolved_at": null
  }
}
```

### PATCH /api/tickets/{id}
Update ticket status or assignment (Admin only)

**Request:**
```json
{
  "status": "in_progress",
  "assigned_to": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Ticket updated successfully",
  "data": {
    "id": 1,
    "subject": "Login Issue",
    "status": "in_progress",
    "assigned_to": {
      "id": 5,
      "name": "Admin User",
      "email": "admin@college.edu"
    },
    "updated_at": "2024-01-16T11:00:00Z"
  }
}
```

## Database Indexes

The following indexes are created for optimal performance:
- `status` + `created_at` (descending) - for filtering by status
- `student` + `created_at` (descending) - for student's ticket list
- `assigned_to` + `status` - for admin's assigned tickets

## Permissions

- **List/Retrieve**: Authenticated users (with role-based filtering)
- **Create**: Students only
- **Update/Delete**: Admins only

## Setup

1. Add 'tickets' to INSTALLED_APPS in settings.py
2. Add tickets URLs to main urls.py: `path('api/', include('tickets.urls'))`
3. Run migrations:
   ```bash
   python manage.py makemigrations tickets
   python manage.py migrate tickets
   ```

## Testing

Run tests with:
```bash
python manage.py test tickets
```
