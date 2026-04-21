# College Activity Portal

A full-stack web application for managing college activities, events, announcements, and student engagement.

## 🚀 Features

- **Student Portal**: View events, announcements, reels, and submit support tickets
- **Admin Dashboard**: Manage students, content, tickets, and view analytics
- **Event Management**: Create events, track registrations, and manage capacity
- **Announcements**: Broadcast important information to students
- **Reels**: Share video and image content
- **Support Tickets**: Student support system with status tracking
- **Analytics**: Track engagement, participation, and ticket metrics
- **Dark Mode**: Full dark mode support across all pages
- **PWA**: Progressive Web App - installable on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.1 + Django REST Framework
- **Database**: PostgreSQL (Neon Cloud)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API**: RESTful API with comprehensive endpoints

### Frontend
- **Framework**: Angular 20 (Standalone Components)
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with RxJS

### Deployment
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (frontend), Gunicorn (backend)
- **Database**: Neon PostgreSQL (cloud-hosted)

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd college-activity-portal
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000/api

## 🔧 Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Seed sample data (optional)**
   ```bash
   python manage.py seed_database
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open http://localhost:4200

## 👤 Default Credentials

### Admin Account
- Email: `admin@college.edu`
- Password: `admin123`

### Student Account
- Email: `john.doe@student.edu`
- Password: `student123`

## 📁 Project Structure

```
college-activity-portal/
├── backend/                 # Django backend
│   ├── authentication/      # User authentication & JWT
│   ├── students/           # Student management
│   ├── events/             # Event management
│   ├── announcements/      # Announcements
│   ├── reels/              # Reels (video/image content)
│   ├── tickets/            # Support tickets
│   ├── analytics/          # Analytics & reporting
│   ├── config/             # Django settings
│   └── manage.py
├── frontend/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── shared/     # Shared components & models
│   │   │   └── features/   # Feature modules
│   │   └── index.html
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment variables template
└── README.md
```

## 🔑 Environment Variables

See `.env.example` for all required environment variables:

- `DEBUG`: Set to `False` in production
- `SECRET_KEY`: Django secret key (generate a strong one!)
- `DATABASE_URL`: PostgreSQL connection string
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins

## 🐳 Docker Deployment

### Build and Run
```bash
docker-compose up --build -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Run Migrations in Docker
```bash
docker-compose exec backend python manage.py migrate
```

### Seed Data in Docker
```bash
docker-compose exec backend python manage.py seed_database
```

## 📱 PWA Setup

Before deployment, generate PWA icons:

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 PNG logo
3. Download generated icons
4. Place in `frontend/public/icons/` folder

## 🎨 Features

### Dark Mode
- Toggle using sun/moon icon in navbar
- Preference saved to localStorage
- Smooth transitions across all pages

### Progressive Web App
- Installable on desktop and mobile
- Offline support
- App-like experience

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 API Documentation

API endpoints are documented in each app's README:
- `backend/authentication/README.md`
- `backend/events/README.md`
- `backend/announcements/README.md`
- `backend/reels/README.md`
- `backend/tickets/README.md`
- `backend/analytics/README.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Django REST Framework
- Angular Team
- Tailwind CSS
- Neon Database

---

**Built with ❤️ for college communities**
