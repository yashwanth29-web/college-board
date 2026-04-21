# Announcements App

This Django app manages announcements posted by administrators for students to view.

## Models

### Announcement
- `title`: CharField(max_length=255) - Title of the announcement
- `content`: TextField - Full content of the announcement
- `published_date`: DateTimeField - Auto-set on creation, indexed
- `created_by`: ForeignKey to User - Administrator who created the announcement
- `is_active`: BooleanField - Soft delete flag (default: True)

## API Endpoints

### GET /api/announcements/
List all active announcements (authenticated users)
- Ordered by published_date descending
- Supports pagination (page_size=20)

### GET /api/announcements/{id}/
Retrieve a specific announcement (authenticated users)

### POST /api/announcements/
Create a new announcement (admin only)
- Request body: `{"title": "...", "content": "..."}`
- `created_by` is automatically set to the current user

### PUT/PATCH /api/announcements/{id}/
Update an announcement (admin only)

### DELETE /api/announcements/{id}/
Soft delete an announcement by setting is_active=False (admin only)

## Permissions
- List/Retrieve: Any authenticated user
- Create/Update/Delete: Admin users only (IsAdminUser permission)

## Database Indexes
- `published_date` (descending)
- `is_active` + `published_date` (composite index)
