# Implementation Plan: Smart College Activity & Resource Portal

## Overview

This implementation plan guides the development of a full-stack web application from scratch. The system consists of an Angular 20 frontend, Django REST Framework backend, and PostgreSQL database, all containerized with Docker. The implementation follows an incremental approach, building core infrastructure first, then adding features progressively, and finally integrating everything into a complete system.

## Tasks

- [x] 1. Set up project structure and Docker infrastructure
  - Create root directory structure with backend/, frontend/, and docker-compose.yml
  - Create backend/Dockerfile with Python 3.11, Django dependencies, and Gunicorn configuration
  - Create frontend/Dockerfile with Node 20, Angular build, and nginx configuration
  - Create docker-compose.yml orchestrating PostgreSQL, backend, and frontend containers
  - Create .env.example with environment variable templates
  - Create .gitignore excluding node_modules, __pycache__, .env, and build artifacts
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 14.1, 14.2, 14.3, 14.4, 14.7, 14.8_

- [ ] 2. Initialize Django backend project
  - [x] 2.1 Create Django project and configure settings
    - Initialize Django project with name 'config'
    - Create requirements.txt with Django 5.1+, DRF 3.16+, simplejwt 5.5+, psycopg2-binary, Pillow, django-cors-headers, gunicorn
    - Configure settings.py with PostgreSQL database connection, CORS settings, JWT configuration, media file handling
    - Configure REST Framework settings with JWT authentication, pagination, and permission classes
    - Create config/urls.py with API routing structure
    - _Requirements: 11.2, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ]* 2.2 Write unit tests for Django configuration
    - Test database connection settings
    - Test CORS configuration
    - Test JWT token generation settings
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 3. Implement authentication system
  - [x] 3.1 Create custom User model
    - Create authentication app with custom User model extending AbstractBaseUser
    - Implement email-based authentication with is_student and is_staff flags
    - Create custom user manager for user creation
    - Create and run migrations for User model
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.1, 13.1_

  - [x] 3.2 Implement authentication endpoints
    - Create UserSerializer and RegistrationSerializer with validation
    - Implement POST /api/auth/register endpoint with password hashing
    - Implement POST /api/auth/login endpoint returning JWT tokens
    - Implement POST /api/auth/token/refresh endpoint for token refresh
    - Create custom permission classes: IsAdminUser, IsStudentUser, IsOwnerOrAdmin
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 9.1, 9.2, 13.1_

  - [ ]* 3.3 Write unit tests for authentication
    - Test user registration with valid and invalid data
    - Test login with valid and invalid credentials
    - Test JWT token generation and validation
    - Test token refresh functionality
    - Test duplicate email registration rejection
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

- [ ] 4. Implement Student model and endpoints
  - [x] 4.1 Create Student model and profile management
    - Create students app with Student model linked to User via OneToOneField
    - Add fields: student_id (unique), enrollment_date, phone, department, year
    - Create database indexes on student_id and enrollment_date
    - Create and run migrations for Student model
    - _Requirements: 2.1, 2.2, 2.4, 10.1, 10.8_

  - [x] 4.2 Implement student management endpoints
    - Create StudentSerializer with nested user data
    - Implement GET /api/students endpoint with pagination and search (admin only)
    - Implement PATCH /api/students/{id} endpoint for profile updates
    - Implement PATCH /api/students/{id}/deactivate endpoint (admin only)
    - Link student profile creation to registration endpoint
    - _Requirements: 2.2, 2.3, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.6_

  - [ ]* 4.3 Write unit tests for student management
    - Test student profile creation during registration
    - Test student list retrieval with pagination
    - Test student search by name, email, and student_id
    - Test profile update validation
    - Test account deactivation
    - _Requirements: 2.2, 2.5, 7.2, 7.3, 7.4, 7.5_

- [x] 5. Checkpoint - Verify authentication and student management
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Announcement system
  - [x] 6.1 Create Announcement model and endpoints
    - Create announcements app with Announcement model
    - Add fields: title, content, published_date, created_by (FK to User), is_active
    - Create database indexes on published_date and is_active
    - Create and run migrations for Announcement model
    - _Requirements: 3.2, 10.3, 10.8_

  - [x] 6.2 Implement announcement API endpoints
    - Create AnnouncementSerializer with creator information
    - Implement GET /api/announcements endpoint with pagination (page_size=20)
    - Implement POST /api/announcements endpoint (admin only)
    - Implement DELETE /api/announcements/{id} endpoint (admin only)
    - Order announcements by published_date descending
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 9.4_

  - [ ]* 6.3 Write unit tests for announcements
    - Test announcement creation by admin
    - Test announcement list retrieval with pagination
    - Test announcement ordering by date
    - Test announcement deletion
    - Test permission restrictions for non-admin users
    - _Requirements: 3.2, 3.3, 3.5, 3.6_

- [ ] 7. Implement Event system with registration
  - [x] 7.1 Create Event and EventRegistration models
    - Create events app with Event model
    - Add fields: title, description, date, time, location, capacity, current_registrations, created_by, is_active
    - Create EventRegistration model with student and event foreign keys
    - Add unique_together constraint on (student, event)
    - Create database indexes on date, time, and registration fields
    - Create and run migrations for Event and EventRegistration models
    - _Requirements: 4.1, 4.2, 10.2, 10.6, 10.7, 10.8_

  - [x] 7.2 Implement event management endpoints
    - Create EventSerializer and EventRegistrationSerializer
    - Implement GET /api/events endpoint with pagination, ordered by date ascending
    - Implement POST /api/events endpoint (admin only)
    - Implement POST /api/events/{id}/register endpoint with capacity validation
    - Implement GET /api/events/my-events endpoint for student's registered events
    - Implement GET /api/events/{id}/registrations endpoint (admin only)
    - Add is_full property check before allowing registration
    - Increment current_registrations counter on successful registration
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.3_

  - [ ]* 7.3 Write unit tests for event system
    - Test event creation with all required fields
    - Test event list retrieval ordered by date
    - Test event registration with capacity validation
    - Test duplicate registration prevention
    - Test capacity limit enforcement
    - Test my-events endpoint filtering
    - Test registration count accuracy
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 4.7_

- [ ] 8. Implement Media/Reel system
  - [x] 8.1 Create Media model and file upload handling
    - Create reels app with Media model
    - Add fields: title, description, file (FileField), file_type, file_size, thumbnail, created_by, views, is_active
    - Configure media file storage with upload_to paths
    - Create database indexes on created_at and is_active
    - Create and run migrations for Media model
    - _Requirements: 5.1, 5.2, 10.5, 10.8_

  - [x] 8.2 Implement reel endpoints with file validation
    - Create MediaSerializer with file URL generation
    - Implement file validation: max size 50MB, allowed types (video/mp4, video/webm, image/jpeg, image/png)
    - Implement GET /api/reels endpoint with pagination (page_size=10), ordered by created_at descending
    - Implement POST /api/reels endpoint with multipart/form-data support (admin only)
    - Configure Django settings for file upload limits
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.7, 13.1, 13.2_

  - [ ]* 8.3 Write unit tests for media system
    - Test media upload with valid file types
    - Test file size validation (reject files > 50MB)
    - Test file type validation
    - Test media list retrieval with pagination
    - Test media ordering by creation date
    - _Requirements: 5.2, 5.3, 5.6_

- [x] 9. Checkpoint - Verify content management features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Support Ticket system
  - [x] 10.1 Create Ticket model
    - Create tickets app with Ticket model
    - Add fields: subject, description, category (choices), status (choices), student (FK), assigned_to (FK), created_at, updated_at, resolved_at
    - Define status choices: open, in_progress, resolved, closed
    - Define category choices: technical, academic, administrative, other
    - Create database indexes on status, created_at, student, and assigned_to
    - Create and run migrations for Ticket model
    - _Requirements: 6.1, 6.2, 6.6, 10.4, 10.8_

  - [x] 10.2 Implement ticket management endpoints
    - Create TicketSerializer with student and assignee information
    - Implement GET /api/tickets endpoint with role-based filtering (students see own, admins see all)
    - Implement POST /api/tickets endpoint (student only)
    - Implement PATCH /api/tickets/{id} endpoint for status updates and assignment (admin only)
    - Add status query parameter filtering
    - Order tickets by created_at descending
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 9.5_

  - [ ]* 10.3 Write unit tests for ticket system
    - Test ticket creation by student
    - Test ticket list filtering by role
    - Test ticket status updates
    - Test ticket assignment to admin
    - Test status query parameter filtering
    - Test permission restrictions
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.7_

- [x] 11. Implement Analytics endpoints
  - [x] 11.1 Create analytics views and calculations
    - Create analytics app with view functions
    - Implement GET /api/analytics/overview endpoint with aggregate counts (admin only)
    - Implement GET /api/analytics/participation endpoint with event registration statistics
    - Implement GET /api/analytics/tickets endpoint with resolution metrics
    - Add date range filtering with start_date and end_date query parameters
    - Calculate average resolution time for tickets
    - Generate registrations_over_time data grouped by date
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 11.2 Write unit tests for analytics
    - Test overview statistics calculation
    - Test participation metrics with date filtering
    - Test ticket resolution time calculation
    - Test status distribution calculation
    - Test date range filtering
    - _Requirements: 8.1, 8.2, 8.4, 8.6_

- [x] 12. Implement security features
  - [x] 12.1 Add rate limiting and account lockout
    - Configure DRF throttling with rates: anon=100/hour, user=1000/hour
    - Create custom LoginRateThrottle limiting login attempts to 5/minute
    - Implement account lockout after 5 failed login attempts within 15 minutes using cache
    - Apply throttle to login endpoint
    - _Requirements: 13.5, 13.6_

  - [x] 12.2 Configure security headers and HTTPS settings
    - Configure CORS_ALLOWED_ORIGINS in settings.py
    - Set SECURE_SSL_REDIRECT, SESSION_COOKIE_SECURE, CSRF_COOKIE_SECURE for production
    - Configure security headers: X_FRAME_OPTIONS, SECURE_BROWSER_XSS_FILTER, SECURE_CONTENT_TYPE_NOSNIFF
    - Configure HSTS settings with 1-year max-age
    - _Requirements: 13.3, 13.4, 13.7_

  - [ ]* 12.3 Write integration tests for security features
    - Test rate limiting enforcement
    - Test account lockout after failed attempts
    - Test CORS policy enforcement
    - Test security headers in responses
    - _Requirements: 13.5, 13.6, 13.3_

- [x] 13. Initialize Angular frontend project
  - [x] 13.1 Create Angular project with standalone components
    - Initialize Angular 20 project with standalone components and signals
    - Install dependencies: Tailwind CSS 3.x, RxJS
    - Configure Tailwind CSS with responsive breakpoints
    - Create directory structure: core/, features/, shared/
    - Create subdirectories: core/guards, core/interceptors, core/services, shared/components, shared/models
    - Configure TypeScript strict mode
    - _Requirements: 14.1, 14.5, 12.1_

  - [x] 13.2 Create TypeScript models and interfaces
    - Create shared/models/user.model.ts with User and Student interfaces
    - Create shared/models/announcement.model.ts with Announcement interface
    - Create shared/models/event.model.ts with Event and EventRegistration interfaces
    - Create shared/models/ticket.model.ts with Ticket interface
    - Create shared/models/reel.model.ts with Reel interface
    - Create shared/models/api.model.ts with PaginatedResponse and AuthResponse interfaces
    - _Requirements: 9.8_

  - [ ]* 13.3 Write unit tests for models
    - Test model interface type checking
    - Test model validation logic if any
    - _Requirements: 9.8_

- [x] 14. Implement Angular authentication services
  - [x] 14.1 Create authentication service and interceptors
    - Create core/services/auth.service.ts with login, register, logout, refreshToken methods
    - Implement token storage in localStorage
    - Create core/interceptors/jwt.interceptor.ts to attach JWT to requests
    - Implement automatic token refresh on 401 errors in interceptor
    - Create core/interceptors/error.interceptor.ts for global error handling
    - Create core/guards/auth.guard.ts for route protection
    - Create core/guards/admin.guard.ts for admin-only routes
    - _Requirements: 1.1, 1.2, 1.3, 9.1, 9.2_

  - [ ]* 14.2 Write unit tests for authentication service
    - Test login method with valid credentials
    - Test register method with validation
    - Test token refresh logic
    - Test logout functionality
    - Test isAuthenticated check
    - _Requirements: 1.1, 1.2, 1.5_

- [x] 15. Checkpoint - Verify backend and frontend foundation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Implement Angular feature services
  - [x] 16.1 Create API services for all features
    - Create core/services/api.service.ts as base service with HTTP methods
    - Create features/announcements/services/announcement.service.ts
    - Create features/events/services/event.service.ts
    - Create features/tickets/services/ticket.service.ts
    - Create features/reels/services/reel.service.ts
    - Create features/students/services/student.service.ts (admin)
    - Create features/analytics/services/analytics.service.ts (admin)
    - Implement all CRUD methods matching backend API endpoints
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ]* 16.2 Write unit tests for API services
    - Test HTTP request construction
    - Test response parsing
    - Test error handling
    - Test pagination handling
    - _Requirements: 9.8, 9.9_

- [x] 17. Implement student authentication components
  - [x] 17.1 Create login and registration components
    - Create features/auth/login/login.component.ts with reactive form
    - Create features/auth/register/register.component.ts with validation
    - Implement form validation for email, password, student_id
    - Add error message display for authentication failures
    - Implement redirect to dashboard on successful login
    - Style forms with Tailwind CSS responsive utilities
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 2.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 17.2 Write component tests for authentication
    - Test form validation
    - Test successful login flow
    - Test error handling
    - Test registration flow
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

- [x] 18. Implement student dashboard and navigation
  - [x] 18.1 Create dashboard and shared navigation components
    - Create features/dashboard/dashboard.component.ts with overview cards
    - Create shared/components/navbar/navbar.component.ts with responsive menu
    - Create shared/components/sidebar/sidebar.component.ts with navigation links
    - Implement hamburger menu for mobile devices (< 768px)
    - Create shared/components/loading-spinner/loading-spinner.component.ts
    - Configure app.routes.ts with route guards
    - _Requirements: 2.3, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 18.2 Write component tests for navigation
    - Test responsive menu behavior
    - Test route navigation
    - Test authentication guard
    - _Requirements: 12.6_

- [x] 19. Implement announcement feature components
  - [x] 19.1 Create announcement list and detail components
    - Create features/announcements/announcement-list/announcement-list.component.ts
    - Implement pagination with page navigation controls
    - Create features/announcements/announcement-detail/announcement-detail.component.ts
    - Display announcements ordered by date descending
    - Add loading states and error handling
    - Style with Tailwind CSS responsive grid layout
    - _Requirements: 3.3, 3.4, 3.6, 12.2, 12.3, 12.4_

  - [ ]* 19.2 Write component tests for announcements
    - Test announcement list rendering
    - Test pagination controls
    - Test detail view navigation
    - Test loading and error states
    - _Requirements: 3.3, 3.4, 3.6_

- [x] 20. Implement event feature components
  - [x] 20.1 Create event list and registration components
    - Create features/events/event-list/event-list.component.ts with pagination
    - Create features/events/event-detail/event-detail.component.ts with registration button
    - Create features/events/my-events/my-events.component.ts for registered events
    - Implement event registration with capacity validation
    - Display event capacity and registration count
    - Show separate views for available vs registered events
    - Add confirmation dialog for event registration
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 12.2, 12.3, 12.4_

  - [ ]* 20.2 Write component tests for events
    - Test event list rendering
    - Test registration flow
    - Test capacity validation
    - Test my-events filtering
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [x] 21. Checkpoint - Verify student portal features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 22. Implement reel feed component
  - [x] 22.1 Create vertical scrolling media feed
    - Create features/reels/reel-feed/reel-feed.component.ts
    - Implement vertical scrollable feed layout
    - Add video playback controls for video reels
    - Implement lazy loading for media items
    - Add pagination with infinite scroll
    - Display image reels with full-width display
    - Style with Tailwind CSS for mobile-first design
    - _Requirements: 5.3, 5.4, 5.5, 12.2, 12.3, 12.4_

  - [ ]* 22.2 Write component tests for reel feed
    - Test media rendering
    - Test video playback
    - Test infinite scroll pagination
    - Test responsive layout
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 23. Implement ticket feature components
  - [x] 23.1 Create ticket management components for students
    - Create features/tickets/ticket-list/ticket-list.component.ts
    - Create features/tickets/ticket-create/ticket-create.component.ts with form
    - Create features/tickets/ticket-detail/ticket-detail.component.ts
    - Implement category selection dropdown
    - Display ticket status with color-coded badges
    - Add form validation for subject and description
    - Filter tickets to show only student's own tickets
    - _Requirements: 6.1, 6.2, 6.3, 12.2, 12.3, 12.4_

  - [ ]* 23.2 Write component tests for tickets
    - Test ticket creation form
    - Test ticket list filtering
    - Test status display
    - Test form validation
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 24. Implement admin portal components
  - [x] 24.1 Create admin dashboard and student management
    - Create features/admin-dashboard/admin-dashboard.component.ts with statistics cards
    - Create features/student-management/student-list/student-list.component.ts
    - Create features/student-management/student-detail/student-detail.component.ts
    - Implement student search by name, email, student_id
    - Add pagination for student list (page_size=50)
    - Implement student profile editing
    - Add account deactivation functionality
    - Apply admin guard to all admin routes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 12.2, 12.3, 12.4_

  - [x] 24.2 Create admin content management components
    - Create features/announcement-management/announcement-create/announcement-create.component.ts
    - Create features/announcement-management/announcement-edit/announcement-edit.component.ts
    - Create features/event-management/event-create/event-create.component.ts
    - Create features/event-management/event-edit/event-edit.component.ts
    - Create features/event-management/event-registrations/event-registrations.component.ts
    - Create features/reel-management/reel-upload/reel-upload.component.ts with file upload
    - Implement file upload with drag-and-drop for media
    - Add file type and size validation on frontend
    - _Requirements: 3.1, 3.5, 4.1, 4.7, 5.1, 5.2, 5.6, 12.2, 12.3, 12.4_

  - [x] 24.3 Create admin ticket management components
    - Create features/ticket-management/ticket-queue/ticket-queue.component.ts
    - Create features/ticket-management/ticket-assign/ticket-assign.component.ts
    - Implement ticket status update dropdown
    - Add ticket assignment to admin users
    - Display all tickets with student information
    - Add status filtering (open, in_progress, resolved, closed)
    - _Requirements: 6.4, 6.5, 6.6, 6.7, 12.2, 12.3, 12.4_

  - [x] 24.4 Create analytics dashboard component
    - Create features/analytics/analytics-dashboard/analytics-dashboard.component.ts
    - Display overview statistics (total students, events, announcements, tickets)
    - Implement date range picker for filtering
    - Create chart component for event registrations over time
    - Create pie chart for ticket status distribution
    - Display event participation metrics with fill rates
    - Show average ticket resolution time
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 12.2, 12.3, 12.4_

  - [ ]* 24.5 Write component tests for admin features
    - Test student management CRUD operations
    - Test content creation forms
    - Test ticket assignment flow
    - Test analytics data display
    - Test admin guard enforcement
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 3.1, 4.1, 6.4, 8.1_

- [x] 25. Checkpoint - Verify admin portal features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 26. Configure Docker deployment
  - [x] 26.1 Finalize Docker configuration and environment setup
    - Update docker-compose.yml with health checks for PostgreSQL
    - Configure backend container to wait for database readiness
    - Add volume mounts for postgres_data, media_files, static_files
    - Configure environment variables in .env file
    - Set up nginx.conf for Angular app with API proxy
    - Configure backend to run migrations automatically on startup
    - Test docker-compose up --build for all services
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [ ]* 26.2 Write integration tests for Docker deployment
    - Test container startup sequence
    - Test database connectivity from backend
    - Test API accessibility from frontend
    - Test volume persistence
    - _Requirements: 11.5, 11.6, 11.7, 11.8_

- [x] 27. Create comprehensive documentation
  - [x] 27.1 Write README with setup and API documentation
    - Document project overview and architecture
    - Write setup instructions for local development
    - Document Docker deployment steps with docker-compose commands
    - Document all API endpoints with HTTP methods, parameters, and response formats
    - Include example curl commands for each endpoint
    - Document authentication requirements for protected endpoints
    - Add environment variable configuration guide
    - Document database schema and relationships
    - _Requirements: 14.4, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [x] 27.2 Add API documentation endpoint
    - Configure DRF browsable API or integrate Swagger/OpenAPI
    - Ensure /api/docs endpoint is accessible
    - _Requirements: 15.6_

- [x] 28. Final integration and testing
  - [ ]* 28.1 Run end-to-end integration tests
    - Test complete user registration and login flow
    - Test student viewing announcements, events, and reels
    - Test student event registration and ticket creation
    - Test admin content creation and management
    - Test admin ticket assignment and resolution
    - Test analytics data accuracy
    - Test responsive design on mobile, tablet, and desktop viewports
    - _Requirements: 1.1, 2.2, 3.4, 4.4, 5.4, 6.2, 7.1, 8.1, 12.2, 12.3, 12.4_

  - [x] 28.2 Verify all requirements and create admin superuser
    - Run docker-compose up and verify all containers start successfully
    - Create Django superuser for admin access
    - Verify database migrations are applied
    - Test API endpoints with curl or Postman
    - Verify frontend connects to backend API
    - Test authentication flow end-to-end
    - Verify media file uploads work correctly
    - Check all security headers are present
    - _Requirements: 11.5, 13.4, 13.7, 15.4_

- [x] 29. Final checkpoint - Complete application verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- This is a greenfield project - all code will be created from scratch
- The implementation builds incrementally: infrastructure → backend → frontend → integration
- Checkpoints ensure validation at key milestones
- Docker containers must be running for the application to function
- The backend API must be accessible before frontend development can be fully tested
- Media file uploads require proper volume mounting in Docker
- Admin superuser must be created manually using Django management command
- All passwords are hashed using PBKDF2 with SHA256
- JWT tokens expire after 15 minutes (access) and 7 days (refresh)
- Rate limiting is enforced: 100 req/hour for anonymous, 1000 req/hour for authenticated users
- CORS must be configured to allow frontend domain in production
