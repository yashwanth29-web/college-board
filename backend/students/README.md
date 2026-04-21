# Students App

This Django app provides student management endpoints for the College Activity Portal.

## Features

- **Student List**: Paginated list of all students with search functionality (Admin only)
- **Student Profile Update**: Update student information like department, year, and phone (Admin only)
- **Student Deactivation**: Deactivate student accounts to prevent login (Admin only)

## API Endpoints

### GET /api/students

Get paginated list of students with optional search.

**Authentication**: Required (Admin only)

**Query Parameters**:
- `search` (optional): Search by name, email, or student_id
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 50, max: 100)

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "count": 1250,
    "next": "http://api.example.com/api/students?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@college.edu",
          "is_active": true
        },
        "student_id": "STU2024001",
        "enrollment_date": "2024-01-15",
        "phone": "+1234567890",
        "department": "Computer Science",
        "year": 2
      }
    ]
  }
}
```

**Example Requests**:
```bash
# Get all students
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/students

# Search by name
curl -H "Authorization: Bearer <token>" "http://localhost:8000/api/students?search=John"

# Search by email
curl -H "Authorization: Bearer <token>" "http://localhost:8000/api/students?search=john.doe@"

# Search by student ID
curl -H "Authorization: Bearer <token>" "http://localhost:8000/api/students?search=STU2024001"

# Custom page size
curl -H "Authorization: Bearer <token>" "http://localhost:8000/api/students?page_size=10"
```

### PATCH /api/students/{id}

Update student profile information.

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: Student ID (integer)

**Request Body**:
```json
{
  "department": "Information Technology",
  "year": 3,
  "phone": "+1234567890"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@college.edu",
      "is_active": true
    },
    "student_id": "STU2024001",
    "enrollment_date": "2024-01-15",
    "phone": "+1234567890",
    "department": "Information Technology",
    "year": 3
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "year": ["Year must be between 1 and 4"]
  }
}
```

**Example Request**:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"department": "Software Engineering", "year": 3}' \
  http://localhost:8000/api/students/1
```

### PATCH /api/students/{id}/deactivate

Deactivate a student account to prevent login.

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: Student ID (integer)

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Student account deactivated"
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Student account is already deactivated"
}
```

**Example Request**:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/students/1/deactivate
```

## Serializers

### StudentSerializer

Serializes student data with nested user information.

**Fields**:
- `id` (read-only): Student profile ID
- `user` (read-only): Nested user object with id, name, email, is_active
- `student_id` (read-only): Unique student identifier
- `enrollment_date` (read-only): Date student enrolled
- `phone`: Student phone number
- `department`: Student's department
- `year`: Current year (1-4)

### StudentUpdateSerializer

Serializer for updating student profile information.

**Fields**:
- `phone`: Student phone number
- `department`: Student's department
- `year`: Current year (1-4, validated)

## Permissions

All endpoints require:
1. User must be authenticated (JWT token)
2. User must have admin privileges (`is_staff=True`)

Students cannot access these endpoints - they are admin-only.

## Testing

Run tests with:
```bash
python manage.py test students
```

Test coverage includes:
- Admin access to student list
- Student/unauthenticated access denied
- Search functionality (name, email, student_id)
- Profile updates (full and partial)
- Validation (invalid year)
- Account deactivation
- Pagination
- Read-only field protection

## Integration

The students app is integrated into the main project:

1. Added to `INSTALLED_APPS` in `config/settings.py`
2. URLs included in `config/urls.py` at `/api/students/`
3. Uses models from `authentication` app (User, Student)
4. Uses permissions from `authentication.permissions` (IsAdminUser)

## Notes

- Student profile creation is handled by the registration endpoint in the authentication app
- The Student model is defined in the authentication app to maintain the one-to-one relationship with User
- All endpoints return consistent JSON responses with `status`, `message`, and `data` fields
- Pagination defaults to 50 items per page (configurable up to 100)
- Search is case-insensitive and searches across name, email, and student_id fields
