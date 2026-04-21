# Reels App

This Django app manages media content (videos and images) for the reel-style feed feature.

## Features

- Media file upload with validation (max 50MB)
- Support for video formats: MP4, WebM
- Support for image formats: JPEG, PNG
- Automatic file size tracking
- Thumbnail support for videos
- View count tracking
- Pagination with 10 items per page
- Admin-only upload permissions
- Full URL generation for media files

## Models

### Media
- `title`: CharField - Media title
- `description`: TextField - Optional description
- `file`: FileField - Media file (stored in `media/reels/YYYY/MM/`)
- `file_type`: CharField - Type (video/image)
- `file_size`: IntegerField - File size in bytes
- `thumbnail`: ImageField - Optional thumbnail (stored in `media/thumbnails/YYYY/MM/`)
- `created_by`: ForeignKey - User who uploaded the media
- `created_at`: DateTimeField - Upload timestamp (indexed)
- `is_active`: BooleanField - Active status
- `views`: IntegerField - View count

## API Endpoints

### GET /api/reels
Retrieve paginated list of active media items.

**Authentication**: Required (all authenticated users)

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10, max: 50)

**Response**:
```json
{
  "status": "success",
  "data": {
    "count": 28,
    "next": "http://api.example.com/api/reels?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Campus Tour 2024",
        "description": "Virtual tour of our campus",
        "file_url": "http://api.example.com/media/reels/2024/01/campus_tour.mp4",
        "file_type": "video",
        "thumbnail_url": "http://api.example.com/media/thumbnails/2024/01/campus_tour.jpg",
        "created_by_name": "Admin User",
        "created_at": "2024-01-15T10:00:00Z",
        "views": 1250
      }
    ]
  }
}
```

### POST /api/reels
Upload new media content.

**Authentication**: Required (admin only)

**Content-Type**: multipart/form-data

**Request Body**:
- `title`: string (required) - Media title
- `description`: string (optional) - Media description
- `file`: file (required) - Media file
- `file_type`: string (required) - Type: "video" or "image"
- `thumbnail`: file (optional) - Thumbnail image

**Validation**:
- File size: Maximum 50MB
- Allowed video types: video/mp4, video/webm
- Allowed image types: image/jpeg, image/png

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Media uploaded successfully",
  "data": {
    "id": 2,
    "title": "Student Achievements",
    "description": "Celebrating our students",
    "file_url": "http://api.example.com/media/reels/2024/01/achievements.mp4",
    "file_type": "video",
    "file_size": 15728640,
    "thumbnail_url": null,
    "created_by": 5,
    "created_by_name": "Admin User",
    "created_at": "2024-01-16T16:00:00Z",
    "is_active": true,
    "views": 0
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "File size exceeds maximum limit of 50MB"
}
```

## File Storage

Media files are stored in the following structure:
```
media/
├── reels/
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── video1.mp4
│   │   │   └── image1.jpg
│   │   └── 02/
│   └── ...
└── thumbnails/
    ├── 2024/
    │   ├── 01/
    │   │   └── video1_thumb.jpg
    │   └── 02/
    └── ...
```

## Settings Configuration

The following settings are configured in `config/settings.py`:

```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
```

## Permissions

- **GET /api/reels**: All authenticated users
- **POST /api/reels**: Admin users only (is_staff=True)

## Database Indexes

The Media model includes the following indexes for performance:
- `created_at` (descending) - For chronological ordering
- `is_active, created_at` (composite) - For filtering active media

## Admin Interface

The Media model is registered in Django Admin with:
- List display: title, file_type, created_by, created_at, is_active, views
- Filters: file_type, is_active, created_at
- Search: title, description
- Date hierarchy: created_at
