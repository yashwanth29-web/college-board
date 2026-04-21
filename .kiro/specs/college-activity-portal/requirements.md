# Requirements Document

## Introduction

The Smart College Activity & Resource Portal is a full-stack web application system designed to streamline communication and resource management between college students and administrators. The system consists of a student-facing mobile-responsive portal for viewing announcements, events, and raising support tickets, and an administrative portal for managing content, students, and analytics. The system uses modern web technologies including Angular 20 for the frontend, Django REST Framework for the backend API, PostgreSQL for data persistence, JWT for authentication, and Docker for containerized deployment.

## Glossary

- **Student_Portal**: The Angular-based web application interface used by students to view content and interact with the system
- **Admin_Portal**: The Angular/Django Admin interface used by administrators to manage system content and users
- **Backend_API**: The Django REST Framework service that provides REST endpoints for data operations
- **Authentication_Service**: The JWT-based authentication system using SimpleJWT
- **Database**: The PostgreSQL database system storing all application data
- **Student**: A registered user with student role who can view content and raise tickets
- **Administrator**: A user with admin role who can manage content, students, and tickets
- **Announcement**: A text-based notice posted by administrators for students to view
- **Event**: A scheduled college activity that students can view and register for
- **Reel**: A short-form video or media update displayed in a feed format
- **Support_Ticket**: A help request raised by a student and assigned to an administrator
- **Container**: A Docker container running a specific service component
- **API_Endpoint**: A REST API URL path that accepts HTTP requests and returns JSON responses

## Requirements

### Requirement 1: User Authentication

**User Story:** As a student or administrator, I want to securely log in to the portal, so that I can access my personalized content and features.

#### Acceptance Criteria

1. WHEN a user submits valid credentials to /api/auth/login, THE Authentication_Service SHALL return a JWT access token and refresh token
2. WHEN a user submits invalid credentials, THE Authentication_Service SHALL return an error message with HTTP 401 status
3. WHEN a JWT token expires, THE Authentication_Service SHALL reject requests with HTTP 401 status
4. THE Authentication_Service SHALL validate JWT tokens for all protected API endpoints
5. WHEN a user registers with valid information, THE Backend_API SHALL create a new Student record and return HTTP 201 status
6. WHEN a user registers with duplicate email, THE Backend_API SHALL return an error message with HTTP 400 status

### Requirement 2: Student Registration and Profile Management

**User Story:** As a student, I want to register and manage my profile, so that I can access the portal and keep my information current.

#### Acceptance Criteria

1. THE Student_Portal SHALL provide a registration form accepting name, email, password, and student ID
2. WHEN a student submits the registration form with valid data, THE Backend_API SHALL create a Student record in the Database
3. WHEN a student logs in, THE Student_Portal SHALL display the student dashboard
4. THE Backend_API SHALL store student data including name, email, hashed password, student ID, and enrollment date
5. WHEN a student updates profile information, THE Backend_API SHALL validate and persist the changes to the Database

### Requirement 3: Announcement Management

**User Story:** As an administrator, I want to post announcements, so that students can stay informed about important notices.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide a form to create announcements with title, content, and publication date
2. WHEN an administrator creates an announcement, THE Backend_API SHALL store it in the Database with timestamp
3. THE Backend_API SHALL provide a GET /api/announcements endpoint returning announcements ordered by date descending
4. WHEN a student accesses the Student_Portal, THE Student_Portal SHALL display all published announcements
5. WHEN an administrator deletes an announcement, THE Backend_API SHALL remove it from the Database
6. THE Backend_API SHALL support pagination for announcements with page size of 20 items

### Requirement 4: Event Management and Registration

**User Story:** As an administrator, I want to create and manage events, so that students can discover and register for college activities.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide a form to create events with title, description, date, time, location, and capacity
2. WHEN an administrator creates an event, THE Backend_API SHALL store it in the Database
3. THE Backend_API SHALL provide a GET /api/events endpoint returning upcoming events ordered by date ascending
4. WHEN a student registers for an event, THE Backend_API SHALL create a registration record linking the Student and Event
5. WHEN event capacity is reached, THE Backend_API SHALL reject new registrations with HTTP 400 status
6. THE Student_Portal SHALL display registered events separately from available events
7. WHEN an administrator views an event, THE Admin_Portal SHALL display the count of registered participants

### Requirement 5: Reel-Style Media Feed

**User Story:** As a student, I want to view short-form media updates in a feed format, so that I can quickly consume engaging college content.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide an interface to upload media files with title, description, and media file
2. WHEN an administrator uploads media, THE Backend_API SHALL store the file and create a Media record in the Database
3. THE Backend_API SHALL provide a GET /api/reels endpoint returning media items ordered by creation date descending
4. THE Student_Portal SHALL display media items in a vertical scrollable feed format
5. THE Student_Portal SHALL support video playback for uploaded video files
6. THE Backend_API SHALL validate uploaded files are video or image formats with maximum size of 50MB

### Requirement 6: Support Ticket System

**User Story:** As a student, I want to raise support tickets, so that I can get help from administrators or mentors.

#### Acceptance Criteria

1. THE Student_Portal SHALL provide a form to create tickets with subject, description, and category
2. WHEN a student submits a ticket, THE Backend_API SHALL create a Ticket record linked to the Student
3. THE Backend_API SHALL provide a GET /api/tickets endpoint returning tickets filtered by student ID
4. THE Admin_Portal SHALL display all open tickets with student information
5. WHEN an administrator updates a ticket status, THE Backend_API SHALL persist the status change to the Database
6. THE Backend_API SHALL support ticket statuses: Open, In Progress, Resolved, Closed
7. WHEN an administrator assigns a ticket, THE Backend_API SHALL link the ticket to the Administrator record

### Requirement 7: Student Data Management

**User Story:** As an administrator, I want to manage student records, so that I can maintain accurate student information.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display a list of all students with name, email, student ID, and enrollment date
2. THE Backend_API SHALL provide a GET /api/students endpoint returning paginated student records
3. WHEN an administrator searches for students, THE Backend_API SHALL filter results by name, email, or student ID
4. WHEN an administrator updates student information, THE Backend_API SHALL validate and persist changes to the Database
5. WHEN an administrator deactivates a student account, THE Backend_API SHALL prevent the student from logging in
6. THE Backend_API SHALL support pagination for student lists with page size of 50 items

### Requirement 8: Analytics and Reporting

**User Story:** As an administrator, I want to view analytics on student participation and activity, so that I can measure engagement and make informed decisions.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display total counts of students, events, announcements, and tickets
2. THE Backend_API SHALL provide a GET /api/analytics/participation endpoint returning event registration statistics
3. THE Admin_Portal SHALL display a chart showing event registrations over time
4. THE Backend_API SHALL calculate and return ticket resolution metrics including average resolution time
5. THE Admin_Portal SHALL display ticket status distribution as a pie chart
6. WHEN an administrator selects a date range, THE Backend_API SHALL filter analytics data by the specified period

### Requirement 9: API Endpoint Structure

**User Story:** As a frontend developer, I want well-structured REST API endpoints, so that I can integrate the frontend applications efficiently.

#### Acceptance Criteria

1. THE Backend_API SHALL provide endpoint /api/auth/login accepting POST requests with email and password
2. THE Backend_API SHALL provide endpoint /api/auth/register accepting POST requests with student registration data
3. THE Backend_API SHALL provide endpoint /api/events accepting GET requests returning event list and POST requests for creating events
4. THE Backend_API SHALL provide endpoint /api/announcements accepting GET requests returning announcement list and POST requests for creating announcements
5. THE Backend_API SHALL provide endpoint /api/tickets accepting GET and POST requests for ticket operations
6. THE Backend_API SHALL provide endpoint /api/students accepting GET requests returning student list
7. THE Backend_API SHALL provide endpoint /api/reels accepting GET requests returning media feed and POST requests for uploading media
8. THE Backend_API SHALL return JSON responses with consistent structure including data, status, and message fields
9. WHEN an API error occurs, THE Backend_API SHALL return appropriate HTTP status codes with descriptive error messages

### Requirement 10: Database Schema and Relationships

**User Story:** As a backend developer, I want a well-designed database schema, so that data integrity is maintained and queries are efficient.

#### Acceptance Criteria

1. THE Database SHALL contain a Students table with columns: id, name, email, password_hash, student_id, enrollment_date, is_active
2. THE Database SHALL contain an Events table with columns: id, title, description, date, time, location, capacity, created_by, created_at
3. THE Database SHALL contain an Announcements table with columns: id, title, content, published_date, created_by, created_at
4. THE Database SHALL contain a Tickets table with columns: id, subject, description, category, status, student_id, assigned_to, created_at, updated_at
5. THE Database SHALL contain a Media table with columns: id, title, description, file_path, file_type, created_by, created_at
6. THE Database SHALL contain an Event_Registrations table linking students to events with columns: id, student_id, event_id, registered_at
7. THE Database SHALL enforce foreign key constraints between related tables
8. THE Database SHALL create indexes on frequently queried columns including email, student_id, and date fields

### Requirement 11: Docker Containerization and Deployment

**User Story:** As a DevOps engineer, I want the application containerized with Docker, so that deployment is consistent and scalable.

#### Acceptance Criteria

1. THE Container configuration SHALL define a frontend container running the Angular application on port 4200
2. THE Container configuration SHALL define a backend container running the Django application on port 8000
3. THE Container configuration SHALL define a database container running PostgreSQL on port 5432
4. THE docker-compose.yml file SHALL orchestrate all three containers with proper networking
5. WHEN docker-compose up is executed, THE Container configuration SHALL start all services in the correct order
6. THE Backend_API container SHALL wait for the Database container to be ready before starting
7. THE Container configuration SHALL mount volumes for database persistence
8. THE Container configuration SHALL set environment variables for database credentials and JWT secret keys

### Requirement 12: Frontend Responsive Design

**User Story:** As a student, I want the portal to work on mobile devices, so that I can access it from my phone or tablet.

#### Acceptance Criteria

1. THE Student_Portal SHALL use Tailwind CSS responsive utilities for layout adaptation
2. WHEN viewed on mobile devices with width less than 768px, THE Student_Portal SHALL display a single-column layout
3. WHEN viewed on tablet devices with width between 768px and 1024px, THE Student_Portal SHALL display a two-column layout
4. WHEN viewed on desktop devices with width greater than 1024px, THE Student_Portal SHALL display a multi-column layout
5. THE Student_Portal SHALL use touch-friendly button sizes of at least 44x44 pixels on mobile devices
6. THE Student_Portal navigation SHALL collapse into a hamburger menu on mobile devices

### Requirement 13: Security and Data Protection

**User Story:** As a system administrator, I want the application to follow security best practices, so that user data is protected from unauthorized access.

#### Acceptance Criteria

1. THE Backend_API SHALL hash all passwords using bcrypt or PBKDF2 before storing in the Database
2. THE Backend_API SHALL validate and sanitize all user inputs to prevent SQL injection attacks
3. THE Backend_API SHALL implement CORS policies restricting API access to authorized frontend domains
4. THE Backend_API SHALL use HTTPS for all API communications in production environment
5. THE Backend_API SHALL implement rate limiting of 100 requests per minute per IP address
6. WHEN a user attempts more than 5 failed login attempts within 15 minutes, THE Authentication_Service SHALL temporarily lock the account
7. THE Backend_API SHALL not expose sensitive information in error messages or API responses

### Requirement 14: Project Repository Structure

**User Story:** As a developer, I want a well-organized repository structure, so that I can navigate and maintain the codebase efficiently.

#### Acceptance Criteria

1. THE repository SHALL contain a /frontend directory with the Angular application code
2. THE repository SHALL contain a /backend directory with the Django application code
3. THE repository SHALL contain a docker-compose.yml file in the root directory
4. THE repository SHALL contain a README.md file with setup instructions and API documentation
5. THE frontend directory SHALL contain subdirectories: /src/app/components, /src/app/services, /src/app/models
6. THE backend directory SHALL contain subdirectories: /api, /authentication, /core
7. THE repository SHALL contain a .gitignore file excluding node_modules, __pycache__, and environment files
8. THE repository SHALL contain environment template files: .env.example for backend configuration

### Requirement 15: API Documentation and Testing

**User Story:** As a developer, I want comprehensive API documentation, so that I can understand and test API endpoints effectively.

#### Acceptance Criteria

1. THE README.md file SHALL document all API endpoints with HTTP methods, request parameters, and response formats
2. THE README.md file SHALL include example curl commands for each API endpoint
3. THE README.md file SHALL document authentication requirements for protected endpoints
4. THE README.md file SHALL include setup instructions for running the application locally
5. THE README.md file SHALL document Docker deployment steps with docker-compose commands
6. THE Backend_API SHALL provide a /api/docs endpoint with interactive API documentation using DRF browsable API or Swagger
