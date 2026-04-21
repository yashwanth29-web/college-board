# Student Portal - Angular Frontend

This is the Angular 20 frontend application for the Smart College Activity & Resource Portal.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── guards/              # Route guards for authentication
│   │   │   ├── interceptors/        # HTTP interceptors (JWT, error handling)
│   │   │   └── services/            # Core services (auth, api)
│   │   ├── features/                # Feature modules
│   │   ├── shared/                  # Shared resources
│   │   │   ├── components/          # Reusable components
│   │   │   └── models/              # TypeScript interfaces and types
│   │   ├── app.component.ts         # Root component
│   │   ├── app.config.ts            # Application configuration
│   │   └── app.routes.ts            # Route definitions
│   ├── index.html                   # Main HTML file
│   ├── main.ts                      # Application entry point
│   └── styles.css                   # Global styles with Tailwind
├── public/                          # Static assets
├── angular.json                     # Angular CLI configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies

```

## Technology Stack

- **Angular 20**: Standalone components with signals
- **TypeScript 5.8**: Strict mode enabled
- **Tailwind CSS 3.x**: Responsive design with custom breakpoints
- **RxJS 7.8**: Reactive programming

## Features

- Standalone components (no NgModules)
- TypeScript strict mode
- Tailwind CSS with responsive breakpoints:
  - Mobile: 320px
  - Tablet: 768px
  - Desktop: 1024px
- Organized directory structure for scalability

## TypeScript Models

All models are located in `src/app/shared/models/`:

- **user.model.ts**: User and Student interfaces
- **announcement.model.ts**: Announcement interface
- **event.model.ts**: Event and EventRegistration interfaces
- **ticket.model.ts**: Ticket interface with status and category types
- **reel.model.ts**: Reel (media) interface
- **api.model.ts**: PaginatedResponse, AuthResponse, and ApiResponse interfaces

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

## Configuration

### TypeScript

TypeScript is configured with strict mode enabled:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

### Tailwind CSS

Tailwind is configured with custom responsive breakpoints:
- `mobile`: 320px
- `tablet`: 768px
- `desktop`: 1024px

## Docker

The application can be containerized using the provided Dockerfile:

```bash
docker build -t student-portal .
docker run -p 4200:4200 student-portal
```

## Next Steps

1. Implement authentication services and guards
2. Create feature modules for:
   - Authentication (login, register)
   - Dashboard
   - Announcements
   - Events
   - Reels
   - Tickets
   - Profile
3. Add HTTP interceptors for JWT and error handling
4. Implement shared components (navbar, sidebar, loading spinner)
