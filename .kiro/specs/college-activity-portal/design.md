# Design Document: Smart College Activity & Resource Portal

## Overview

The Smart College Activity & Resource Portal is a full-stack web application designed to facilitate communication and resource management between college students and administrators. The system architecture follows a modern three-tier approach with clear separation of concerns:

- **Frontend Layer**: Angular 20 single-page applications (Student Portal and Admin Portal) providing responsive, mobile-first user interfaces
- **Backend Layer**: Django REST Framework API server handling business logic, authentication, and data operations
- **Data Layer**: PostgreSQL relational database ensuring data persistence and integrity
- **Infrastructure Layer**: Docker containerization enabling consistent deployment across environments

The system supports two primary user roles:
- **Students**: Can view announcements, browse and register for events, consume media content, and raise support tickets
- **Administrators**: Can manage all content (announcements, events, media), handle student records, process support tickets, and view analytics

Key technical characteristics:
- RESTful API design with JSON data exchange
- JWT-based stateless authentication using djangorestframework-simplejwt
- Responsive design using Tailwind CSS for mobile, tablet, and desktop viewports
- File upload support for media content (videos and images up to 50MB)
- Containerized deployment with Docker Compose orchestration
- PostgreSQL database with proper indexing and foreign key constraints

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        SP[Student Portal<br/>Angular 20 + Tailwind CSS<br/>Port 4200]
        AP[Admin Portal<br/>Angular 20 / Django Admin<br/>Port 4200]
    end
    
    subgraph "API Layer"
        API[Django REST Framework<br/>Port 8000]
        AUTH[Authentication Service<br/>SimpleJWT]
        MEDIA[Media File Handler]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Database<br/>Port 5432)]
        STORAGE[Media Storage<br/>Volume Mount]
    end
    
    SP -->|HTTP/JSON + JWT| API
    AP -->|HTTP/JSON + JWT| API
    API --> AUTH
    API --> MEDIA
    AUTH --> DB
    API --> DB
    MEDIA --> STORAGE
    MEDIA --> DB
    
    style SP fill:#4A90E2
    style AP fill:#4A90E2
    style API fill:#50C878
    style AUTH fill:#50C878
    style DB fill:#F39C12
    style STORAGE fill:#F39C12
```

### Container Architecture

```mermaid
graph LR
    subgraph "Docker Network: college-portal-network"
        subgraph "Frontend Container"
            NG[Angular App<br/>nginx:alpine<br/>Port 4200]
        end
        
        subgraph "Backend Container"
            DJ[Django + DRF<br/>python:3.11<br/>Port 8000]
        end
        
        subgraph "Database Container"
            PG[(PostgreSQL 15<br/>Port 5432)]
        end
        
        VOL1[Volume: postgres-data]
        VOL2[Volume: media-files]
    end
    
    NG -->|API Requests| DJ
    DJ -->|SQL Queries| PG
    PG -.->|Persist| VOL1
    DJ -.->|Store Media| VOL2
    
    style NG fill:#61DAFB
    style DJ fill:#092E20
    style PG fill:#336791
```

### Technology Stack

**Frontend:**
- Angular 20 (standalone components, signals)
- TypeScript 5.x
- Tailwind CSS 3.x for styling
- RxJS for reactive programming
- Angular Router for navigation
- HttpClient for API communication

**Backend:**
- Django 5.1+
- Django REST Framework 3.16+
- djangorestframework-simplejwt 5.5+ for JWT authentication
- psycopg2-binary for PostgreSQL connectivity
- Pillow for image processing
- django-cors-headers for CORS management

**Database:**
- PostgreSQL 15

**DevOps:**
- Docker 24+
- Docker Compose 2.x
- nginx (for serving Angular in production)

### Deployment Architecture

The application uses Docker Compose to orchestrate three containers:

1. **Frontend Container**: Serves the Angular application via nginx
2. **Backend Container**: Runs Django with Gunicorn WSGI server
3. **Database Container**: PostgreSQL with persistent volume

Container startup sequence:
1. PostgreSQL container starts first
2. Backend container waits for database readiness (health check)
3. Backend runs migrations automatically
4. Frontend container starts and connects to backend

## Components and Interfaces

### Frontend Component Structure

#### Student Portal Components

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts              # Route protection
│   ├── interceptors/
│   │   └── jwt.interceptor.ts         # Attach JWT to requests
│   └── services/
│       ├── auth.service.ts            # Authentication logic
│       └── api.service.ts             # Base API communication
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts     # Login form
│   │   └── register/
│   │       └── register.component.ts  # Registration form
│   ├── dashboard/
│   │   └── dashboard.component.ts     # Student home page
│   ├── announcements/
│   │   ├── announcement-list/
│   │   │   └── announcement-list.component.ts
│   │   └── announcement-detail/
│   │       └── announcement-detail.component.ts
│   ├── events/
│   │   ├── event-list/
│   │   │   └── event-list.component.ts
│   │   ├── event-detail/
│   │   │   └── event-detail.component.ts
│   │   └── my-events/
│   │       └── my-events.component.ts  # Registered events
│   ├── reels/
│   │   └── reel-feed/
│   │       └── reel-feed.component.ts  # Vertical scrolling feed
│   ├── tickets/
│   │   ├── ticket-list/
│   │   │   └── ticket-list.component.ts
│   │   ├── ticket-create/
│   │   │   └── ticket-create.component.ts
│   │   └── ticket-detail/
│   │       └── ticket-detail.component.ts
│   └── profile/
│       └── profile.component.ts        # Student profile
├── shared/
│   ├── components/
│   │   ├── navbar/
│   │   │   └── navbar.component.ts
│   │   ├── sidebar/
│   │   │   └── sidebar.component.ts
│   │   └── loading-spinner/
│   │       └── loading-spinner.component.ts
│   └── models/
│       ├── user.model.ts
│       ├── announcement.model.ts
│       ├── event.model.ts
│       ├── ticket.model.ts
│       └── reel.model.ts
└── app.routes.ts                       # Route configuration
```

#### Admin Portal Components

```
src/app/
├── features/
│   ├── admin-dashboard/
│   │   └── admin-dashboard.component.ts
│   ├── student-management/
│   │   ├── student-list/
│   │   │   └── student-list.component.ts
│   │   └── student-detail/
│   │       └── student-detail.component.ts
│   ├── announcement-management/
│   │   ├── announcement-create/
│   │   │   └── announcement-create.component.ts
│   │   └── announcement-edit/
│   │       └── announcement-edit.component.ts
│   ├── event-management/
│   │   ├── event-create/
│   │   │   └── event-create.component.ts
│   │   ├── event-edit/
│   │   │   └── event-edit.component.ts
│   │   └── event-registrations/
│   │       └── event-registrations.component.ts
│   ├── reel-management/
│   │   └── reel-upload/
│   │       └── reel-upload.component.ts
│   ├── ticket-management/
│   │   ├── ticket-queue/
│   │   │   └── ticket-queue.component.ts
│   │   └── ticket-assign/
│   │       └── ticket-assign.component.ts
│   └── analytics/
│       └── analytics-dashboard/
│           └── analytics-dashboard.component.ts
```

### Backend API Structure

```
backend/
├── config/
│   ├── settings.py                    # Django settings
│   ├── urls.py                        # Root URL configuration
│   └── wsgi.py
├── authentication/
│   ├── models.py                      # Custom User model
│   ├── serializers.py                 # User serializers
│   ├── views.py                       # Auth endpoints
│   └── urls.py
├── students/
│   ├── models.py                      # Student model
│   ├── serializers.py
│   ├── views.py                       # Student CRUD
│   └── urls.py
├── announcements/
│   ├── models.py                      # Announcement model
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── events/
│   ├── models.py                      # Event, EventRegistration models
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── reels/
│   ├── models.py                      # Media model
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── tickets/
│   ├── models.py                      # Ticket model
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── analytics/
│   ├── views.py                       # Analytics endpoints
│   └── urls.py
└── manage.py
```

### API Service Interfaces (Angular)

**AuthService**
```typescript
interface AuthService {
  login(email: string, password: string): Observable<AuthResponse>;
  register(userData: RegisterRequest): Observable<User>;
  logout(): void;
  refreshToken(): Observable<TokenResponse>;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
}
```

**AnnouncementService**
```typescript
interface AnnouncementService {
  getAnnouncements(page: number): Observable<PaginatedResponse<Announcement>>;
  getAnnouncementById(id: number): Observable<Announcement>;
  createAnnouncement(data: AnnouncementCreate): Observable<Announcement>;
  deleteAnnouncement(id: number): Observable<void>;
}
```

**EventService**
```typescript
interface EventService {
  getEvents(page: number): Observable<PaginatedResponse<Event>>;
  getEventById(id: number): Observable<Event>;
  createEvent(data: EventCreate): Observable<Event>;
  registerForEvent(eventId: number): Observable<EventRegistration>;
  getMyEvents(): Observable<Event[]>;
  getEventRegistrations(eventId: number): Observable<EventRegistration[]>;
}
```

**TicketService**
```typescript
interface TicketService {
  getMyTickets(): Observable<Ticket[]>;
  createTicket(data: TicketCreate): Observable<Ticket>;
  updateTicketStatus(id: number, status: TicketStatus): Observable<Ticket>;
  assignTicket(id: number, adminId: number): Observable<Ticket>;
}
```

**ReelService**
```typescript
interface ReelService {
  getReels(page: number): Observable<PaginatedResponse<Reel>>;
  uploadReel(data: FormData): Observable<Reel>;
}
```

## Data Models

### Django Models

#### User Model (Custom)

```python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model supporting both students and administrators"""
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active', 'is_student']),
        ]
```

#### Student Model

```python
class Student(models.Model):
    """Student profile extending User model"""
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='student_profile'
    )
    student_id = models.CharField(max_length=50, unique=True, db_index=True)
    enrollment_date = models.DateField(auto_now_add=True)
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(null=True, blank=True)
    
    class Meta:
        db_table = 'students'
        indexes = [
            models.Index(fields=['student_id']),
            models.Index(fields=['enrollment_date']),
        ]
    
    def __str__(self):
        return f"{self.user.name} ({self.student_id})"
```

#### Announcement Model

```python
class Announcement(models.Model):
    """Announcements posted by administrators"""
    title = models.CharField(max_length=255)
    content = models.TextField()
    published_date = models.DateTimeField(auto_now_add=True, db_index=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='announcements'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'announcements'
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['-published_date']),
            models.Index(fields=['is_active', '-published_date']),
        ]
    
    def __str__(self):
        return self.title
```

#### Event Model

```python
class Event(models.Model):
    """College events that students can register for"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField(db_index=True)
    time = models.TimeField()
    location = models.CharField(max_length=255)
    capacity = models.IntegerField()
    current_registrations = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_events'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['date', 'time']
        indexes = [
            models.Index(fields=['date', 'time']),
            models.Index(fields=['is_active', 'date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.date}"
    
    @property
    def is_full(self):
        return self.current_registrations >= self.capacity
```

#### EventRegistration Model

```python
class EventRegistration(models.Model):
    """Many-to-many relationship between students and events"""
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='event_registrations'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_registrations'
        unique_together = ['student', 'event']
        indexes = [
            models.Index(fields=['student', 'event']),
            models.Index(fields=['event', 'registered_at']),
        ]
    
    def __str__(self):
        return f"{self.student.user.name} -> {self.event.title}"
```

#### Media Model (Reels)

```python
class Media(models.Model):
    """Media files for reel-style feed"""
    FILE_TYPE_CHOICES = [
        ('video', 'Video'),
        ('image', 'Image'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='reels/%Y/%m/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_size = models.IntegerField()  # in bytes
    thumbnail = models.ImageField(upload_to='thumbnails/%Y/%m/', null=True, blank=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='media_uploads'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_active = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'media'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active', '-created_at']),
        ]
    
    def __str__(self):
        return self.title
```

#### Ticket Model

```python
class Ticket(models.Model):
    """Support tickets raised by students"""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('academic', 'Academic'),
        ('administrative', 'Administrative'),
        ('other', 'Other'),
    ]
    
    subject = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='open',
        db_index=True
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['student', '-created_at']),
            models.Index(fields=['assigned_to', 'status']),
        ]
    
    def __str__(self):
        return f"Ticket #{self.id}: {self.subject}"
```

### Database Schema Diagram

```mermaid
erDiagram
    User ||--o| Student : "has profile"
    User ||--o{ Announcement : "creates"
    User ||--o{ Event : "creates"
    User ||--o{ Media : "uploads"
    User ||--o{ Ticket : "assigned to"
    Student ||--o{ EventRegistration : "registers"
    Student ||--o{ Ticket : "raises"
    Event ||--o{ EventRegistration : "has registrations"
    
    User {
        int id PK
        string email UK
        string name
        string password_hash
        boolean is_active
        boolean is_staff
        boolean is_student
        datetime date_joined
    }
    
    Student {
        int id PK
        int user_id FK
        string student_id UK
        date enrollment_date
        string phone
        string department
        int year
    }
    
    Announcement {
        int id PK
        string title
        text content
        datetime published_date
        int created_by FK
        boolean is_active
    }
    
    Event {
        int id PK
        string title
        text description
        date date
        time time
        string location
        int capacity
        int current_registrations
        int created_by FK
        datetime created_at
        boolean is_active
    }
    
    EventRegistration {
        int id PK
        int student_id FK
        int event_id FK
        datetime registered_at
    }
    
    Media {
        int id PK
        string title
        text description
        string file_path
        string file_type
        int file_size
        string thumbnail
        int created_by FK
        datetime created_at
        boolean is_active
        int views
    }
    
    Ticket {
        int id PK
        string subject
        text description
        string category
        string status
        int student_id FK
        int assigned_to FK
        datetime created_at
        datetime updated_at
        datetime resolved_at
    }
```

### TypeScript Models (Frontend)

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  isStudent: boolean;
  isStaff: boolean;
}

export interface Student {
  id: number;
  userId: number;
  studentId: string;
  enrollmentDate: string;
  phone?: string;
  department?: string;
  year?: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishedDate: string;
  createdBy: number;
  isActive: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentRegistrations: number;
  isFull: boolean;
  isActive: boolean;
}

export interface EventRegistration {
  id: number;
  studentId: number;
  eventId: number;
  registeredAt: string;
}

export interface Reel {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'video' | 'image';
  thumbnailUrl?: string;
  createdAt: string;
  views: number;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  category: 'technical' | 'academic' | 'administrative' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  studentId: number;
  assignedTo?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
```


## API Specifications

### Authentication Endpoints

#### POST /api/auth/register
**Description**: Register a new student account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@college.edu",
  "password": "SecurePass123!",
  "student_id": "STU2024001"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Student registered successfully",
  "data": {
    "id": 1,
    "email": "john.doe@college.edu",
    "name": "John Doe",
    "is_student": true,
    "student_profile": {
      "id": 1,
      "student_id": "STU2024001",
      "enrollment_date": "2024-01-15"
    }
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Email already exists",
  "errors": {
    "email": ["User with this email already exists."]
  }
}
```

#### POST /api/auth/login
**Description**: Authenticate user and receive JWT tokens

**Request Body**:
```json
{
  "email": "john.doe@college.edu",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "john.doe@college.edu",
      "name": "John Doe",
      "is_student": true,
      "is_staff": false
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

#### POST /api/auth/token/refresh
**Description**: Refresh access token using refresh token

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Announcement Endpoints

#### GET /api/announcements
**Description**: Retrieve paginated list of announcements

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "count": 45,
    "next": "http://api.example.com/api/announcements?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Campus Closure Notice",
        "content": "The campus will be closed on...",
        "published_date": "2024-01-15T10:30:00Z",
        "created_by": {
          "id": 5,
          "name": "Admin User"
        },
        "is_active": true
      }
    ]
  }
}
```

#### POST /api/announcements
**Description**: Create a new announcement (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "title": "New Semester Schedule",
  "content": "The new semester will begin on..."
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Announcement created successfully",
  "data": {
    "id": 2,
    "title": "New Semester Schedule",
    "content": "The new semester will begin on...",
    "published_date": "2024-01-16T14:20:00Z",
    "created_by": {
      "id": 5,
      "name": "Admin User"
    },
    "is_active": true
  }
}
```

#### DELETE /api/announcements/{id}
**Description**: Delete an announcement (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (204 No Content)

### Event Endpoints

#### GET /api/events
**Description**: Retrieve paginated list of upcoming events

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "count": 12,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Tech Fest 2024",
        "description": "Annual technology festival...",
        "date": "2024-02-20",
        "time": "09:00:00",
        "location": "Main Auditorium",
        "capacity": 500,
        "current_registrations": 234,
        "is_full": false,
        "is_active": true,
        "created_by": {
          "id": 5,
          "name": "Admin User"
        }
      }
    ]
  }
}
```

#### POST /api/events
**Description**: Create a new event (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "title": "Career Fair 2024",
  "description": "Meet top employers...",
  "date": "2024-03-15",
  "time": "10:00:00",
  "location": "Sports Complex",
  "capacity": 1000
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Event created successfully",
  "data": {
    "id": 2,
    "title": "Career Fair 2024",
    "description": "Meet top employers...",
    "date": "2024-03-15",
    "time": "10:00:00",
    "location": "Sports Complex",
    "capacity": 1000,
    "current_registrations": 0,
    "is_full": false,
    "is_active": true
  }
}
```

#### POST /api/events/{id}/register
**Description**: Register current student for an event

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Successfully registered for event",
  "data": {
    "id": 15,
    "student_id": 1,
    "event_id": 2,
    "registered_at": "2024-01-16T15:30:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Event is at full capacity"
}
```

#### GET /api/events/my-events
**Description**: Get events the current student is registered for

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Tech Fest 2024",
      "date": "2024-02-20",
      "time": "09:00:00",
      "location": "Main Auditorium",
      "registration": {
        "id": 10,
        "registered_at": "2024-01-10T12:00:00Z"
      }
    }
  ]
}
```

#### GET /api/events/{id}/registrations
**Description**: Get list of students registered for an event (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "event": {
      "id": 1,
      "title": "Tech Fest 2024",
      "capacity": 500,
      "current_registrations": 234
    },
    "registrations": [
      {
        "id": 1,
        "student": {
          "id": 1,
          "name": "John Doe",
          "student_id": "STU2024001",
          "email": "john.doe@college.edu"
        },
        "registered_at": "2024-01-10T12:00:00Z"
      }
    ]
  }
}
```

### Reel Endpoints

#### GET /api/reels
**Description**: Retrieve paginated media feed

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 10)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
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
        "created_at": "2024-01-15T10:00:00Z",
        "views": 1250,
        "created_by": {
          "id": 5,
          "name": "Admin User"
        }
      }
    ]
  }
}
```

#### POST /api/reels
**Description**: Upload new media content (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`
- `Content-Type: multipart/form-data`

**Request Body** (FormData):
```
title: "Student Achievements"
description: "Celebrating our students"
file: <binary file data>
file_type: "video"
```

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
    "created_at": "2024-01-16T16:00:00Z"
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

### Ticket Endpoints

#### GET /api/tickets
**Description**: Get tickets (filtered by role)
- Students see only their own tickets
- Admins see all tickets

**Query Parameters**:
- `status` (optional): Filter by status (open, in_progress, resolved, closed)
- `page` (optional): Page number (default: 1)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
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
          "student_id": "STU2024001"
        },
        "assigned_to": null,
        "created_at": "2024-01-15T09:00:00Z",
        "updated_at": "2024-01-15T09:00:00Z"
      }
    ]
  }
}
```

#### POST /api/tickets
**Description**: Create a new support ticket (Student only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "subject": "Library Access Problem",
  "description": "My library card is not working",
  "category": "administrative"
}
```

**Response** (201 Created):
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
    "student_id": 1,
    "created_at": "2024-01-16T10:30:00Z"
  }
}
```

#### PATCH /api/tickets/{id}
**Description**: Update ticket status or assignment (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "status": "in_progress",
  "assigned_to": 5
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Ticket updated successfully",
  "data": {
    "id": 1,
    "status": "in_progress",
    "assigned_to": {
      "id": 5,
      "name": "Admin User"
    },
    "updated_at": "2024-01-16T11:00:00Z"
  }
}
```

### Student Management Endpoints

#### GET /api/students
**Description**: Get paginated list of students (Admin only)

**Query Parameters**:
- `search` (optional): Search by name, email, or student_id
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 50)

**Headers**:
- `Authorization: Bearer <access_token>`

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
        "department": "Computer Science",
        "year": 2
      }
    ]
  }
}
```

#### PATCH /api/students/{id}
**Description**: Update student information (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

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
    "student_id": "STU2024001",
    "department": "Information Technology",
    "year": 3,
    "phone": "+1234567890"
  }
}
```

#### PATCH /api/students/{id}/deactivate
**Description**: Deactivate a student account (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Student account deactivated"
}
```

### Analytics Endpoints

#### GET /api/analytics/overview
**Description**: Get dashboard overview statistics (Admin only)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
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

#### GET /api/analytics/participation
**Description**: Get event participation statistics (Admin only)

**Query Parameters**:
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
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
      },
      {
        "date": "2024-01-16",
        "count": 67
      }
    ]
  }
}
```

#### GET /api/analytics/tickets
**Description**: Get ticket resolution metrics (Admin only)

**Query Parameters**:
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)

**Headers**:
- `Authorization: Bearer <access_token>`

**Response** (200 OK):
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

### API Response Format Standards

All API responses follow a consistent structure:

**Success Response**:
```json
{
  "status": "success",
  "message": "Optional success message",
  "data": { /* response data */ }
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

**HTTP Status Codes**:
- 200: Success (GET, PATCH)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error


## Authentication and Authorization

### JWT Authentication Flow

```mermaid
sequenceDiagram
    participant Client as Angular App
    participant API as Django API
    participant JWT as SimpleJWT
    participant DB as PostgreSQL
    
    Client->>API: POST /api/auth/login<br/>{email, password}
    API->>DB: Query User by email
    DB-->>API: User record
    API->>API: Verify password (bcrypt)
    API->>JWT: Generate tokens
    JWT-->>API: {access, refresh}
    API-->>Client: {access, refresh, user}
    
    Note over Client: Store tokens in localStorage
    
    Client->>API: GET /api/events<br/>Authorization: Bearer <access>
    API->>JWT: Validate access token
    JWT-->>API: Token valid + user claims
    API->>DB: Query events
    DB-->>API: Event data
    API-->>Client: Event list
    
    Note over Client: Access token expires
    
    Client->>API: POST /api/auth/token/refresh<br/>{refresh}
    API->>JWT: Validate refresh token
    JWT-->>API: Token valid
    API->>JWT: Generate new access token
    JWT-->>API: New access token
    API-->>Client: {access}
```

### JWT Configuration

**Token Lifetimes**:
- Access Token: 15 minutes
- Refresh Token: 7 days

**Django Settings** (`settings.py`):
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### Angular JWT Interceptor

**jwt.interceptor.ts**:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  
  // Skip token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
  
  // Add token to request
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error) => {
      // Handle 401 errors by refreshing token
      if (error.status === 401 && !req.url.includes('/auth/token/refresh')) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Retry original request with new token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
            return next(newReq);
          }),
          catchError((refreshError) => {
            // Refresh failed, logout user
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

### Route Guards

**auth.guard.ts**:
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirect to login with return URL
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  
  if (user && user.isStaff) {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};
```

### Permission Classes (Django)

**permissions.py**:
```python
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsStudentUser(permissions.BasePermission):
    """Allow access only to student users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_student

class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access to object owner or admin"""
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.student.user == request.user
```

### Password Security

**Password Hashing**:
- Algorithm: PBKDF2 with SHA256 (Django default)
- Iterations: 600,000 (Django 5.1 default)
- Salt: Automatically generated per password

**Django Settings**:
```python
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

## Security Implementation

### CORS Configuration

**Django Settings** (`settings.py`):
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ...
]

# Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

# Production
CORS_ALLOWED_ORIGINS = [
    "https://portal.college.edu",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### Rate Limiting

**Using Django REST Framework Throttling**:

**settings.py**:
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'login': '5/minute',  # Custom rate for login attempts
    }
}
```

**Custom Login Throttle** (`throttles.py`):
```python
from rest_framework.throttling import AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    """Limit login attempts to prevent brute force attacks"""
    scope = 'login'
    
    def get_cache_key(self, request, view):
        # Throttle by IP address
        ident = self.get_ident(request)
        return f'throttle_login_{ident}'
```

**Apply to Login View**:
```python
from rest_framework.views import APIView
from .throttles import LoginRateThrottle

class LoginView(APIView):
    throttle_classes = [LoginRateThrottle]
    permission_classes = []
    
    def post(self, request):
        # Login logic
        pass
```

### Input Validation and Sanitization

**Django REST Framework Serializers**:
```python
from rest_framework import serializers
from django.core.validators import EmailValidator, RegexValidator

class StudentRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=255,
        required=True,
        trim_whitespace=True
    )
    email = serializers.EmailField(
        validators=[EmailValidator()],
        required=True
    )
    password = serializers.CharField(
        min_length=8,
        max_length=128,
        write_only=True,
        required=True
    )
    student_id = serializers.CharField(
        max_length=50,
        required=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{3}\d{7}$',
                message='Student ID must be in format: ABC1234567'
            )
        ]
    )
    
    def validate_email(self, value):
        """Ensure email is from college domain"""
        if not value.endswith('@college.edu'):
            raise serializers.ValidationError(
                "Email must be from college domain"
            )
        return value.lower()
    
    def validate_password(self, value):
        """Validate password strength"""
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value
```

**SQL Injection Prevention**:
- Django ORM automatically parameterizes queries
- Never use raw SQL with string interpolation
- Use parameterized queries for raw SQL:

```python
# SAFE - Parameterized query
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT * FROM students WHERE student_id = %s", [student_id])

# UNSAFE - Never do this
cursor.execute(f"SELECT * FROM students WHERE student_id = '{student_id}'")
```

**XSS Prevention**:
- Angular automatically sanitizes HTML in templates
- Django templates auto-escape HTML
- Use `DomSanitizer` in Angular for trusted content:

```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

### File Upload Security

**Django File Validation**:
```python
from django.core.exceptions import ValidationError

def validate_file_size(file):
    """Limit file size to 50MB"""
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    if file.size > max_size:
        raise ValidationError(f'File size cannot exceed 50MB')

def validate_file_type(file):
    """Validate file is video or image"""
    allowed_types = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png']
    if file.content_type not in allowed_types:
        raise ValidationError(f'File type not allowed')

class MediaSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        validators=[validate_file_size, validate_file_type]
    )
    
    class Meta:
        model = Media
        fields = ['title', 'description', 'file', 'file_type']
```

**Django Settings**:
```python
# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Allowed file extensions
ALLOWED_MEDIA_EXTENSIONS = ['.mp4', '.webm', '.jpg', '.jpeg', '.png']
```

### HTTPS and Security Headers

**Production Django Settings**:
```python
# HTTPS settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Account Lockout

**Custom Authentication Backend** (`backends.py`):
```python
from django.contrib.auth.backends import ModelBackend
from django.core.cache import cache
from django.utils import timezone

class ThrottledAuthBackend(ModelBackend):
    """Authentication backend with account lockout"""
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Check if account is locked
        lockout_key = f'lockout_{username}'
        attempts_key = f'attempts_{username}'
        
        if cache.get(lockout_key):
            return None
        
        # Attempt authentication
        user = super().authenticate(request, username, password, **kwargs)
        
        if user is None:
            # Increment failed attempts
            attempts = cache.get(attempts_key, 0) + 1
            cache.set(attempts_key, attempts, 900)  # 15 minutes
            
            # Lock account after 5 failed attempts
            if attempts >= 5:
                cache.set(lockout_key, True, 900)  # Lock for 15 minutes
        else:
            # Clear failed attempts on success
            cache.delete(attempts_key)
        
        return user
```

## Docker Configuration

### Dockerfile - Backend

**backend/Dockerfile**:
```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . /app/

# Create media directory
RUN mkdir -p /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]
```

**backend/requirements.txt**:
```
Django==5.1.5
djangorestframework==3.16.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.6.0
psycopg2-binary==2.9.10
Pillow==11.0.0
gunicorn==23.0.0
python-dotenv==1.0.1
```

### Dockerfile - Frontend

**frontend/Dockerfile**:
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular app
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist/student-portal /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf**:
```nginx
server {
    listen 4200;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files proxy
    location /media/ {
        proxy_pass http://backend:8000;
    }
}
```

### Docker Compose Configuration

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: college-portal-db
    environment:
      POSTGRES_DB: college_portal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - college-portal-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: college-portal-backend
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application"
    environment:
      DEBUG: ${DEBUG:-False}
      SECRET_KEY: ${SECRET_KEY}
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/college_portal
      ALLOWED_HOSTS: ${ALLOWED_HOSTS:-localhost,127.0.0.1}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:-http://localhost:4200}
    volumes:
      - ./backend:/app
      - media_files:/app/media
      - static_files:/app/staticfiles
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - college-portal-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: college-portal-frontend
    ports:
      - "4200:4200"
    depends_on:
      - backend
    networks:
      - college-portal-network

volumes:
  postgres_data:
    driver: local
  media_files:
    driver: local
  static_files:
    driver: local

networks:
  college-portal-network:
    driver: bridge
```

**.env.example**:
```env
# Django settings
DEBUG=False
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,portal.college.edu

# Database
DB_PASSWORD=secure_password_here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200,https://portal.college.edu

# JWT
JWT_SECRET_KEY=your-jwt-secret-key-here
```

### Docker Commands

**Development Setup**:
```bash
# Build and start all containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Database Operations**:
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d college_portal
```

**Container Management**:
```bash
# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose up -d --build backend

# Execute command in container
docker-compose exec backend python manage.py shell
```


## Error Handling

### Frontend Error Handling

#### HTTP Error Interceptor

**error.interceptor.ts**:
```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error.message || 'Invalid request';
            break;
          case 401:
            errorMessage = 'Authentication required';
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = error.error.message || 'An error occurred';
        }
      }
      
      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
```

#### Component-Level Error Handling

```typescript
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(private eventService: EventService) {}
  
  ngOnInit() {
    this.loadEvents();
  }
  
  loadEvents() {
    this.loading = true;
    this.error = null;
    
    this.eventService.getEvents(1).subscribe({
      next: (response) => {
        this.events = response.results;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events. Please try again.';
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }
  
  registerForEvent(eventId: number) {
    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        // Show success message
        this.loadEvents(); // Refresh list
      },
      error: (error) => {
        if (error.status === 400) {
          this.error = 'Event is at full capacity';
        } else {
          this.error = 'Failed to register for event';
        }
      }
    });
  }
}
```

### Backend Error Handling

#### Custom Exception Handler

**exceptions.py**:
```python
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """Custom exception handler for consistent error responses"""
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize error response format
        custom_response = {
            'status': 'error',
            'message': str(exc),
            'errors': response.data if isinstance(response.data, dict) else {}
        }
        response.data = custom_response
    else:
        # Handle unexpected exceptions
        logger.error(f'Unhandled exception: {exc}', exc_info=True)
        response = Response(
            {
                'status': 'error',
                'message': 'An unexpected error occurred',
                'errors': {}
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return response
```

**settings.py**:
```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'config.exceptions.custom_exception_handler',
}
```

#### Custom Exceptions

**exceptions.py**:
```python
from rest_framework.exceptions import APIException
from rest_framework import status

class EventFullException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Event is at full capacity'
    default_code = 'event_full'

class AlreadyRegisteredException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Already registered for this event'
    default_code = 'already_registered'

class InvalidFileTypeException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid file type'
    default_code = 'invalid_file_type'

class FileSizeExceededException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'File size exceeds maximum limit'
    default_code = 'file_size_exceeded'
```

#### View-Level Error Handling

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .exceptions import EventFullException, AlreadyRegisteredException

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """Register current student for an event"""
        try:
            event = self.get_object()
            student = request.user.student_profile
            
            # Check if already registered
            if EventRegistration.objects.filter(
                student=student, 
                event=event
            ).exists():
                raise AlreadyRegisteredException()
            
            # Check capacity
            if event.is_full:
                raise EventFullException()
            
            # Create registration atomically
            with transaction.atomic():
                registration = EventRegistration.objects.create(
                    student=student,
                    event=event
                )
                event.current_registrations += 1
                event.save()
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Successfully registered for event',
                    'data': EventRegistrationSerializer(registration).data
                },
                status=status.HTTP_201_CREATED
            )
            
        except (EventFullException, AlreadyRegisteredException) as e:
            return Response(
                {
                    'status': 'error',
                    'message': str(e)
                },
                status=e.status_code
            )
        except Exception as e:
            logger.error(f'Error registering for event: {e}', exc_info=True)
            return Response(
                {
                    'status': 'error',
                    'message': 'Failed to register for event'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### Database Error Handling

#### Transaction Management

```python
from django.db import transaction, IntegrityError

class TicketViewSet(viewsets.ModelViewSet):
    
    def create(self, request):
        """Create a new ticket with transaction safety"""
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                ticket = serializer.save(
                    student=request.user.student_profile
                )
                
                return Response(
                    {
                        'status': 'success',
                        'message': 'Ticket created successfully',
                        'data': TicketSerializer(ticket).data
                    },
                    status=status.HTTP_201_CREATED
                )
        except IntegrityError as e:
            logger.error(f'Database integrity error: {e}')
            return Response(
                {
                    'status': 'error',
                    'message': 'Failed to create ticket due to data conflict'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
```

#### Connection Pooling and Retry Logic

**settings.py**:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Connection pooling
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### Logging Strategy

**settings.py**:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/django.log',
            'maxBytes': 1024 * 1024 * 10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'api': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
    },
}
```

## Testing Strategy

### Overview

The Smart College Activity & Resource Portal testing strategy employs a multi-layered approach combining unit tests, integration tests, and end-to-end tests. Property-based testing is **not applicable** for this feature as it primarily consists of:
- Infrastructure as Code (Docker configuration)
- Simple CRUD operations with database persistence
- REST API endpoints with standard request/response patterns
- UI components with rendering logic
- Authentication and authorization flows

Instead, the testing strategy focuses on:
- **Unit Tests**: Testing individual components, services, and API endpoints with specific examples
- **Integration Tests**: Testing interactions between components, database operations, and API flows
- **End-to-End Tests**: Testing complete user workflows across the full stack
- **Manual Testing**: UI/UX validation, accessibility testing, and cross-browser compatibility

### Backend Testing (Django)

#### Unit Tests

**Test Structure**:
```
backend/
├── authentication/
│   └── tests/
│       ├── test_models.py
│       ├── test_serializers.py
│       └── test_views.py
├── events/
│   └── tests/
│       ├── test_models.py
│       ├── test_views.py
│       └── test_registration.py
├── tickets/
│   └── tests/
│       └── test_views.py
└── conftest.py  # Pytest fixtures
```

**Example Unit Tests** (`events/tests/test_registration.py`):
```python
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from events.models import Event, EventRegistration
from students.models import Student

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def student_user(db):
    user = User.objects.create_user(
        email='student@college.edu',
        password='testpass123',
        name='Test Student',
        is_student=True
    )
    Student.objects.create(
        user=user,
        student_id='STU2024001'
    )
    return user

@pytest.fixture
def event(db):
    admin = User.objects.create_user(
        email='admin@college.edu',
        password='adminpass',
        is_staff=True
    )
    return Event.objects.create(
        title='Test Event',
        description='Test Description',
        date='2024-12-31',
        time='10:00:00',
        location='Test Location',
        capacity=100,
        created_by=admin
    )

@pytest.mark.django_db
class TestEventRegistration:
    
    def test_student_can_register_for_event(self, api_client, student_user, event):
        """Test that a student can successfully register for an event"""
        api_client.force_authenticate(user=student_user)
        
        response = api_client.post(f'/api/events/{event.id}/register/')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status'] == 'success'
        assert EventRegistration.objects.filter(
            student=student_user.student_profile,
            event=event
        ).exists()
    
    def test_cannot_register_twice_for_same_event(self, api_client, student_user, event):
        """Test that duplicate registration is prevented"""
        api_client.force_authenticate(user=student_user)
        
        # First registration
        api_client.post(f'/api/events/{event.id}/register/')
        
        # Second registration attempt
        response = api_client.post(f'/api/events/{event.id}/register/')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'already registered' in response.data['message'].lower()
    
    def test_cannot_register_for_full_event(self, api_client, student_user, event):
        """Test that registration is rejected when event is at capacity"""
        api_client.force_authenticate(user=student_user)
        
        # Fill event to capacity
        event.current_registrations = event.capacity
        event.save()
        
        response = api_client.post(f'/api/events/{event.id}/register/')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'full capacity' in response.data['message'].lower()
    
    def test_unauthenticated_user_cannot_register(self, api_client, event):
        """Test that authentication is required for registration"""
        response = api_client.post(f'/api/events/{event.id}/register/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

**Model Tests** (`events/tests/test_models.py`):
```python
import pytest
from events.models import Event
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestEventModel:
    
    def test_event_creation(self):
        """Test creating an event with valid data"""
        admin = User.objects.create_user(
            email='admin@college.edu',
            password='pass',
            is_staff=True
        )
        
        event = Event.objects.create(
            title='Tech Fest',
            description='Annual tech festival',
            date='2024-12-31',
            time='10:00:00',
            location='Main Hall',
            capacity=500,
            created_by=admin
        )
        
        assert event.title == 'Tech Fest'
        assert event.capacity == 500
        assert event.current_registrations == 0
        assert event.is_active is True
    
    def test_is_full_property(self):
        """Test the is_full property returns correct value"""
        admin = User.objects.create_user(
            email='admin@college.edu',
            password='pass',
            is_staff=True
        )
        
        event = Event.objects.create(
            title='Small Event',
            description='Test',
            date='2024-12-31',
            time='10:00:00',
            location='Room 101',
            capacity=10,
            current_registrations=10,
            created_by=admin
        )
        
        assert event.is_full is True
        
        event.current_registrations = 9
        event.save()
        
        assert event.is_full is False
```

#### Integration Tests

**API Integration Tests** (`tests/integration/test_event_flow.py`):
```python
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestEventWorkflow:
    
    def test_complete_event_lifecycle(self):
        """Test complete event creation and registration flow"""
        client = APIClient()
        
        # Create admin user
        admin = User.objects.create_user(
            email='admin@college.edu',
            password='adminpass',
            is_staff=True
        )
        
        # Create student user
        student = User.objects.create_user(
            email='student@college.edu',
            password='studentpass',
            is_student=True
        )
        
        # Admin creates event
        client.force_authenticate(user=admin)
        event_data = {
            'title': 'Career Fair',
            'description': 'Annual career fair',
            'date': '2024-12-31',
            'time': '10:00:00',
            'location': 'Sports Complex',
            'capacity': 1000
        }
        response = client.post('/api/events/', event_data)
        assert response.status_code == 201
        event_id = response.data['data']['id']
        
        # Student registers for event
        client.force_authenticate(user=student)
        response = client.post(f'/api/events/{event_id}/register/')
        assert response.status_code == 201
        
        # Verify registration appears in student's events
        response = client.get('/api/events/my-events/')
        assert response.status_code == 200
        assert len(response.data['data']) == 1
        assert response.data['data'][0]['id'] == event_id
```

#### Test Coverage Requirements

- Minimum 80% code coverage for backend
- 100% coverage for critical paths (authentication, registration, payment logic)
- All API endpoints must have tests
- All model methods must have tests

**Run Tests**:
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest events/tests/test_registration.py

# Run with verbose output
pytest -v
```

### Frontend Testing (Angular)

#### Unit Tests (Jasmine + Karma)

**Component Tests** (`event-list.component.spec.ts`):
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EventListComponent } from './event-list.component';
import { EventService } from '../../services/event.service';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', [
      'getEvents',
      'registerForEvent'
    ]);

    await TestBed.configureTestingModule({
      imports: [EventListComponent, HttpClientTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    const mockEvents = {
      count: 2,
      results: [
        { id: 1, title: 'Event 1', date: '2024-12-31', capacity: 100 },
        { id: 2, title: 'Event 2', date: '2024-12-25', capacity: 50 }
      ]
    };

    eventService.getEvents.and.returnValue(of(mockEvents));

    component.ngOnInit();

    expect(eventService.getEvents).toHaveBeenCalledWith(1);
    expect(component.events.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading events fails', () => {
    eventService.getEvents.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('should register for event successfully', () => {
    const mockRegistration = { id: 1, eventId: 1, studentId: 1 };
    eventService.registerForEvent.and.returnValue(of(mockRegistration));

    component.registerForEvent(1);

    expect(eventService.registerForEvent).toHaveBeenCalledWith(1);
  });
});
```

**Service Tests** (`auth.service.spec.ts`):
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login successfully', () => {
    const mockResponse = {
      access: 'access-token',
      refresh: 'refresh-token',
      user: { id: 1, email: 'test@college.edu', name: 'Test User' }
    };

    service.login('test@college.edu', 'password').subscribe(response => {
      expect(response.access).toBe('access-token');
      expect(localStorage.getItem('access_token')).toBe('access-token');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'success', data: mockResponse });
  });

  it('should return true for authenticated user', () => {
    localStorage.setItem('access_token', 'valid-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for unauthenticated user', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should logout and clear tokens', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('refresh_token', 'refresh');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});
```

**Run Frontend Tests**:
```bash
# Run unit tests
ng test

# Run with coverage
ng test --code-coverage

# Run in headless mode (CI)
ng test --browsers=ChromeHeadless --watch=false
```

#### End-to-End Tests (Playwright)

**E2E Test Structure**:
```
e2e/
├── tests/
│   ├── auth.spec.ts
│   ├── events.spec.ts
│   ├── announcements.spec.ts
│   └── tickets.spec.ts
├── fixtures/
│   └── test-data.ts
└── playwright.config.ts
```

**Example E2E Test** (`e2e/tests/events.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Event Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student
    await page.goto('http://localhost:4200/login');
    await page.fill('input[name="email"]', 'student@college.edu');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should display list of events', async ({ page }) => {
    await page.goto('http://localhost:4200/events');
    
    // Wait for events to load
    await page.waitForSelector('.event-card');
    
    // Check that events are displayed
    const eventCards = await page.locator('.event-card').count();
    expect(eventCards).toBeGreaterThan(0);
  });

  test('should register for an event', async ({ page }) => {
    await page.goto('http://localhost:4200/events');
    
    // Click register button on first event
    await page.click('.event-card:first-child button:has-text("Register")');
    
    // Wait for success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Verify event appears in "My Events"
    await page.goto('http://localhost:4200/events/my-events');
    const myEvents = await page.locator('.event-card').count();
    expect(myEvents).toBeGreaterThan(0);
  });

  test('should show error when registering for full event', async ({ page }) => {
    await page.goto('http://localhost:4200/events');
    
    // Find and click on a full event
    await page.click('.event-card.full button:has-text("Register")');
    
    // Verify error message
    await expect(page.locator('.error-message')).toContainText('full capacity');
  });
});
```

**Run E2E Tests**:
```bash
# Run all E2E tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test e2e/tests/events.spec.ts

# Generate test report
npx playwright show-report
```

### Manual Testing Checklist

#### Functional Testing
- [ ] User registration with valid/invalid data
- [ ] Login with correct/incorrect credentials
- [ ] JWT token refresh on expiration
- [ ] Event creation and editing (admin)
- [ ] Event registration and capacity limits
- [ ] Announcement creation and display
- [ ] Media upload with size/type validation
- [ ] Ticket creation and status updates
- [ ] Student search and filtering (admin)
- [ ] Analytics dashboard data accuracy

#### UI/UX Testing
- [ ] Responsive design on mobile (320px-768px)
- [ ] Responsive design on tablet (768px-1024px)
- [ ] Responsive design on desktop (>1024px)
- [ ] Navigation menu functionality
- [ ] Form validation messages
- [ ] Loading states and spinners
- [ ] Error message display
- [ ] Success notifications

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios (WCAG AA)
- [ ] Focus indicators
- [ ] Alt text for images
- [ ] ARIA labels for interactive elements

#### Security Testing
- [ ] SQL injection attempts
- [ ] XSS attack prevention
- [ ] CSRF token validation
- [ ] Rate limiting enforcement
- [ ] File upload restrictions
- [ ] Authentication bypass attempts
- [ ] Authorization checks for admin endpoints

### Continuous Integration

**GitHub Actions Workflow** (`.github/workflows/ci.yml`):
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov pytest-django
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: |
          cd backend
          pytest --cov=. --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run unit tests
        run: |
          cd frontend
          npm run test:ci
      
      - name: Run E2E tests
        run: |
          cd frontend
          npx playwright install --with-deps
          npm run e2e:ci
```

### Test Data Management

**Fixtures** (`backend/fixtures/test_data.json`):
```json
[
  {
    "model": "auth.user",
    "pk": 1,
    "fields": {
      "email": "admin@college.edu",
      "name": "Admin User",
      "is_staff": true,
      "is_active": true
    }
  },
  {
    "model": "events.event",
    "pk": 1,
    "fields": {
      "title": "Tech Fest 2024",
      "description": "Annual technology festival",
      "date": "2024-12-31",
      "time": "10:00:00",
      "location": "Main Auditorium",
      "capacity": 500,
      "created_by": 1
    }
  }
]
```

**Load Test Data**:
```bash
python manage.py loaddata fixtures/test_data.json
```


## Deployment Strategy

### Development Environment

**Local Development Setup**:

1. **Clone Repository**:
```bash
git clone https://github.com/college/activity-portal.git
cd activity-portal
```

2. **Backend Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with local settings
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Frontend Setup**:
```bash
cd frontend
npm install
ng serve
```

4. **Docker Development**:
```bash
# From project root
docker-compose up --build
```

### Staging Environment

**Infrastructure**:
- Cloud Provider: AWS / Azure / GCP
- Container Orchestration: Docker Compose or Kubernetes
- Database: Managed PostgreSQL (RDS / Azure Database / Cloud SQL)
- File Storage: S3 / Azure Blob / Cloud Storage
- Load Balancer: Application Load Balancer

**Deployment Process**:

1. **Build Docker Images**:
```bash
# Backend
docker build -t college-portal-backend:staging ./backend

# Frontend
docker build -t college-portal-frontend:staging ./frontend
```

2. **Push to Container Registry**:
```bash
docker tag college-portal-backend:staging registry.example.com/backend:staging
docker push registry.example.com/backend:staging

docker tag college-portal-frontend:staging registry.example.com/frontend:staging
docker push registry.example.com/frontend:staging
```

3. **Deploy to Staging**:
```bash
# Using docker-compose
docker-compose -f docker-compose.staging.yml up -d

# Or using Kubernetes
kubectl apply -f k8s/staging/
```

**Staging Configuration** (`docker-compose.staging.yml`):
```yaml
version: '3.8'

services:
  backend:
    image: registry.example.com/backend:staging
    environment:
      DEBUG: "False"
      SECRET_KEY: ${STAGING_SECRET_KEY}
      DATABASE_URL: ${STAGING_DATABASE_URL}
      ALLOWED_HOSTS: staging.college.edu
      CORS_ALLOWED_ORIGINS: https://staging.college.edu
    ports:
      - "8000:8000"

  frontend:
    image: registry.example.com/frontend:staging
    ports:
      - "80:4200"
    depends_on:
      - backend
```

### Production Environment

**Infrastructure Requirements**:

- **Compute**: 
  - Backend: 2-4 vCPUs, 4-8GB RAM (scalable)
  - Frontend: 1-2 vCPUs, 2-4GB RAM (behind CDN)
  
- **Database**: 
  - PostgreSQL 15 (managed service)
  - 2 vCPUs, 8GB RAM minimum
  - Automated backups (daily)
  - Point-in-time recovery enabled
  
- **Storage**:
  - Media files: Object storage (S3/equivalent)
  - Static files: CDN distribution
  
- **Networking**:
  - SSL/TLS certificates (Let's Encrypt or managed)
  - Application Load Balancer
  - Auto-scaling groups
  
- **Monitoring**:
  - Application monitoring (New Relic / Datadog)
  - Log aggregation (CloudWatch / ELK Stack)
  - Uptime monitoring (Pingdom / UptimeRobot)

**Production Deployment Steps**:

1. **Pre-Deployment Checklist**:
   - [ ] All tests passing in CI/CD
   - [ ] Database migrations reviewed
   - [ ] Environment variables configured
   - [ ] SSL certificates valid
   - [ ] Backup created
   - [ ] Rollback plan documented

2. **Database Migration**:
```bash
# Run migrations in production
docker-compose exec backend python manage.py migrate --no-input

# Or via SSH
ssh production-server
cd /app/backend
python manage.py migrate
```

3. **Deploy Application**:
```bash
# Pull latest images
docker-compose pull

# Restart services with zero downtime
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

4. **Post-Deployment Verification**:
```bash
# Check service health
curl https://api.college.edu/health
curl https://portal.college.edu

# Check logs
docker-compose logs -f --tail=100

# Monitor error rates
# Check monitoring dashboard
```

**Production Configuration** (`docker-compose.prod.yml`):
```yaml
version: '3.8'

services:
  backend:
    image: registry.example.com/backend:${VERSION}
    restart: always
    environment:
      DEBUG: "False"
      SECRET_KEY: ${PROD_SECRET_KEY}
      DATABASE_URL: ${PROD_DATABASE_URL}
      ALLOWED_HOSTS: api.college.edu,portal.college.edu
      CORS_ALLOWED_ORIGINS: https://portal.college.edu
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_STORAGE_BUCKET_NAME: college-portal-media
    volumes:
      - /var/log/django:/app/logs
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: registry.example.com/frontend:${VERSION}
    restart: always
    ports:
      - "80:4200"
      - "443:4200"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 2G
```

### CI/CD Pipeline

**Deployment Workflow**:

```mermaid
graph LR
    A[Git Push] --> B[Run Tests]
    B --> C{Tests Pass?}
    C -->|No| D[Notify Failure]
    C -->|Yes| E[Build Images]
    E --> F[Push to Registry]
    F --> G{Branch?}
    G -->|develop| H[Deploy to Staging]
    G -->|main| I[Deploy to Production]
    H --> J[Run Smoke Tests]
    I --> K[Run Smoke Tests]
    J --> L{Tests Pass?}
    K --> M{Tests Pass?}
    L -->|No| N[Rollback]
    M -->|No| O[Rollback]
    L -->|Yes| P[Success]
    M -->|Yes| Q[Success]
```

**GitHub Actions Deployment** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set environment
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "ENVIRONMENT=production" >> $GITHUB_ENV
          else
            echo "ENVIRONMENT=staging" >> $GITHUB_ENV
          fi
      
      - name: Build and push Docker images
        run: |
          docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
          docker build -t registry.example.com/backend:${{ env.ENVIRONMENT }} ./backend
          docker build -t registry.example.com/frontend:${{ env.ENVIRONMENT }} ./frontend
          docker push registry.example.com/backend:${{ env.ENVIRONMENT }}
          docker push registry.example.com/frontend:${{ env.ENVIRONMENT }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
            docker-compose exec backend python manage.py migrate
      
      - name: Run smoke tests
        run: |
          sleep 30
          curl -f https://${{ env.ENVIRONMENT }}.college.edu/health || exit 1
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to ${{ env.ENVIRONMENT }} completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Monitoring and Maintenance

**Health Check Endpoint** (`backend/health/views.py`):
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring"""
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return Response({
            'status': 'healthy',
            'database': 'connected',
            'version': '1.0.0'
        })
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'error': str(e)
        }, status=503)
```

**Monitoring Metrics**:
- API response times (p50, p95, p99)
- Error rates (4xx, 5xx)
- Database query performance
- Memory and CPU usage
- Active user sessions
- Event registration rates
- Ticket resolution times

**Log Aggregation**:
```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'cloudwatch': {
            'class': 'watchtower.CloudWatchLogHandler',
            'log_group': 'college-portal',
            'stream_name': 'django-{strftime:%Y-%m-%d}',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['cloudwatch'],
            'level': 'INFO',
        },
    },
}
```

**Backup Strategy**:
- Database: Automated daily backups with 30-day retention
- Media files: Versioned object storage with lifecycle policies
- Configuration: Version controlled in Git
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 24 hours

### Scaling Considerations

**Horizontal Scaling**:
- Backend: Scale to 3-10 instances based on load
- Frontend: Scale to 2-5 instances behind load balancer
- Database: Read replicas for analytics queries

**Caching Strategy**:
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'college_portal',
        'TIMEOUT': 300,
    }
}

# Cache frequently accessed data
from django.core.cache import cache

def get_announcements():
    cache_key = 'announcements_list'
    announcements = cache.get(cache_key)
    
    if announcements is None:
        announcements = Announcement.objects.filter(is_active=True)[:20]
        cache.set(cache_key, announcements, 300)  # 5 minutes
    
    return announcements
```

**Database Optimization**:
- Connection pooling (pgBouncer)
- Query optimization with indexes
- Materialized views for analytics
- Partitioning for large tables (events, registrations)

## Implementation Notes

### Development Phases

**Phase 1: Foundation (Weeks 1-2)**
- Set up project structure and repositories
- Configure Docker development environment
- Implement authentication system (JWT)
- Create base Django models and migrations
- Set up Angular project with routing

**Phase 2: Core Features (Weeks 3-5)**
- Implement announcement management
- Implement event management and registration
- Implement student profile management
- Build student portal UI components
- Build admin portal UI components

**Phase 3: Advanced Features (Weeks 6-7)**
- Implement reel-style media feed
- Implement support ticket system
- Implement analytics dashboard
- Add file upload functionality
- Implement search and filtering

**Phase 4: Testing & Polish (Week 8)**
- Write comprehensive unit tests
- Write integration tests
- Perform security testing
- Conduct UI/UX testing
- Fix bugs and optimize performance

**Phase 5: Deployment (Week 9)**
- Set up staging environment
- Configure production infrastructure
- Deploy to staging and test
- Deploy to production
- Monitor and iterate

### Key Design Decisions

**1. JWT vs Session Authentication**
- **Decision**: Use JWT (djangorestframework-simplejwt)
- **Rationale**: Stateless authentication scales better, works well with Angular SPA, supports mobile apps in future

**2. Monolithic vs Microservices**
- **Decision**: Monolithic Django application
- **Rationale**: Simpler to develop and deploy for initial version, can be split into microservices later if needed

**3. Django Admin vs Custom Admin Portal**
- **Decision**: Custom Angular admin portal
- **Rationale**: Consistent UI/UX across student and admin interfaces, better mobile support, more flexibility

**4. File Storage**
- **Decision**: Local storage in development, S3 in production
- **Rationale**: Cost-effective, scalable, integrates well with Django

**5. Real-time Updates**
- **Decision**: Polling for initial version
- **Rationale**: Simpler implementation, WebSockets can be added later for real-time notifications

### Security Considerations

**Authentication Security**:
- JWT tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- Short-lived access tokens (15 minutes)
- Refresh token rotation to prevent token theft
- Account lockout after 5 failed login attempts

**API Security**:
- Rate limiting on all endpoints
- Input validation using DRF serializers
- SQL injection prevention via Django ORM
- XSS prevention via Angular sanitization
- CSRF protection for state-changing operations

**File Upload Security**:
- File type validation (whitelist approach)
- File size limits (50MB maximum)
- Virus scanning (integrate ClamAV in production)
- Separate storage domain to prevent XSS

**Data Protection**:
- Password hashing with PBKDF2
- Sensitive data encryption at rest
- HTTPS enforcement in production
- Regular security audits

### Performance Optimization

**Backend Optimization**:
- Database query optimization with select_related/prefetch_related
- Pagination for all list endpoints
- Caching for frequently accessed data
- Database connection pooling
- Async task processing for heavy operations (Celery)

**Frontend Optimization**:
- Lazy loading for Angular modules
- Image optimization and lazy loading
- Code splitting and tree shaking
- Service worker for offline support (PWA)
- CDN for static assets

**Database Optimization**:
- Proper indexing on foreign keys and frequently queried fields
- Composite indexes for multi-column queries
- Regular VACUUM and ANALYZE operations
- Query performance monitoring

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance**:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 for text)
- Focus indicators on interactive elements
- Alt text for images
- ARIA labels for dynamic content
- Form validation with clear error messages

**Implementation**:
```typescript
// Angular component with accessibility
@Component({
  selector: 'app-event-card',
  template: `
    <article 
      class="event-card" 
      role="article"
      [attr.aria-label]="'Event: ' + event.title">
      <h3 id="event-title-{{event.id}}">{{ event.title }}</h3>
      <p>{{ event.description }}</p>
      <button 
        (click)="register()"
        [attr.aria-describedby]="'event-title-' + event.id"
        [disabled]="event.isFull">
        Register
      </button>
    </article>
  `
})
```

### Future Enhancements

**Phase 2 Features** (Post-Launch):
- Real-time notifications using WebSockets
- Email notifications for events and tickets
- Calendar integration (Google Calendar, Outlook)
- Mobile applications (iOS/Android)
- Advanced analytics with charts and reports
- Bulk operations for admin users
- Export functionality (CSV, PDF)
- Multi-language support (i18n)

**Technical Improvements**:
- Migrate to Kubernetes for orchestration
- Implement GraphQL API alongside REST
- Add full-text search with Elasticsearch
- Implement CDN for media files
- Add automated performance testing
- Implement A/B testing framework

### Documentation Requirements

**Developer Documentation**:
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Setup and installation guide
- Contributing guidelines
- Code style guide

**User Documentation**:
- Student user guide
- Administrator user guide
- FAQ section
- Video tutorials
- Troubleshooting guide

**Operations Documentation**:
- Deployment procedures
- Backup and recovery procedures
- Monitoring and alerting setup
- Incident response procedures
- Scaling guidelines

---

## Summary

The Smart College Activity & Resource Portal is designed as a modern, scalable full-stack web application using Angular 20, Django REST Framework, and PostgreSQL. The architecture emphasizes:

- **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
- **Security First**: JWT authentication, input validation, rate limiting, and comprehensive security measures
- **Scalability**: Containerized deployment with Docker, horizontal scaling capabilities, and caching strategies
- **Developer Experience**: Well-structured codebase, comprehensive testing, and clear documentation
- **User Experience**: Responsive design, accessibility compliance, and intuitive interfaces

The design provides a solid foundation for the initial release while allowing for future enhancements and scaling as the user base grows. The testing strategy focuses on unit tests, integration tests, and end-to-end tests rather than property-based testing, as the application primarily consists of CRUD operations, UI components, and infrastructure configuration.

