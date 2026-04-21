# Authentication App

This Django app provides custom user authentication with email-based login.

## Features

- Custom User model extending `AbstractBaseUser` and `PermissionsMixin`
- Email-based authentication (no username required)
- Support for both student and staff users via `is_student` and `is_staff` flags
- Custom UserManager for creating users and superusers
- Password hashing using Django's default PBKDF2 algorithm

## User Model Fields

- `email` (EmailField, unique, indexed): User's email address (used for login)
- `name` (CharField): User's full name
- `is_active` (BooleanField): Whether the user account is active
- `is_staff` (BooleanField): Whether the user can access the admin site
- `is_student` (BooleanField): Whether the user is a student
- `date_joined` (DateTimeField): When the user account was created
- `password` (CharField): Hashed password
- `last_login` (DateTimeField): Last login timestamp

## Database Indexes

- Index on `email` field for fast lookups
- Composite index on `is_active` and `is_student` for filtering queries

## Running Migrations

### With Docker

```bash
# Start the database container
docker-compose up db -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create a superuser
docker-compose exec backend python manage.py createsuperuser
```

### Without Docker (Local PostgreSQL)

```bash
# Navigate to backend directory
cd backend

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser
```

## Running Tests

```bash
# Run all authentication tests
python manage.py test authentication

# Run with verbose output
python manage.py test authentication --verbosity=2
```

## Creating Users Programmatically

```python
from django.contrib.auth import get_user_model

User = get_user_model()

# Create a regular user
user = User.objects.create_user(
    email='user@example.com',
    name='John Doe',
    password='securepassword123'
)

# Create a student user
student = User.objects.create_user(
    email='student@college.edu',
    name='Jane Smith',
    password='securepassword123',
    is_student=True
)

# Create a superuser
admin = User.objects.create_superuser(
    email='admin@college.edu',
    name='Admin User',
    password='adminpassword123'
)
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 1.1**: JWT-based authentication (configured in settings.py)
- **Requirement 1.2**: Email-based login with password validation
- **Requirement 1.3**: Token expiration handling
- **Requirement 1.4**: JWT validation for protected endpoints
- **Requirement 10.1**: Custom User model with proper fields
- **Requirement 13.1**: Password hashing using PBKDF2

## Next Steps

1. Implement authentication endpoints (login, register, token refresh)
2. Create serializers for user data
3. Add permission classes for role-based access control
4. Implement rate limiting for login attempts
