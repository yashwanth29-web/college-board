"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API Root - Smart College Activity & Resource Portal
    
    Welcome to the College Portal API. This API provides endpoints for managing
    college activities, announcements, events, media content, and support tickets.
    
    ## Authentication
    Most endpoints require JWT authentication. Include the token in the Authorization header:
    `Authorization: Bearer <access_token>`
    
    ## Available Endpoints
    
    ### Authentication
    - POST /api/auth/register - Register a new student account
    - POST /api/auth/login - Login and receive JWT tokens
    - POST /api/auth/token/refresh - Refresh access token
    
    ### Announcements
    - GET /api/announcements - List all announcements (paginated)
    - POST /api/announcements - Create announcement (admin only)
    - DELETE /api/announcements/{id} - Delete announcement (admin only)
    
    ### Events
    - GET /api/events - List all events (paginated)
    - POST /api/events - Create event (admin only)
    - POST /api/events/{id}/register - Register for event
    - GET /api/events/my-events - Get student's registered events
    - GET /api/events/{id}/registrations - Get event registrations (admin only)
    
    ### Reels (Media)
    - GET /api/reels - List media feed (paginated)
    - POST /api/reels - Upload media (admin only)
    
    ### Tickets
    - GET /api/tickets - List tickets (filtered by role)
    - POST /api/tickets - Create support ticket
    - PATCH /api/tickets/{id} - Update ticket status (admin only)
    
    ### Students
    - GET /api/students - List students (admin only, paginated)
    - GET /api/students/{id} - Get student details (admin only)
    
    ### Analytics
    - GET /api/analytics/dashboard - Get dashboard statistics (admin only)
    - GET /api/analytics/participation - Get participation metrics (admin only)
    
    ## Rate Limiting
    - Anonymous users: 100 requests/hour
    - Authenticated users: 1000 requests/hour
    - Login endpoint: 5 requests/minute
    
    ## Pagination
    Most list endpoints support pagination with query parameters:
    - `page`: Page number (default: 1)
    - `page_size`: Items per page (default: 20)
    
    ## Error Responses
    All errors follow a consistent format:
    ```json
    {
        "status": "error",
        "message": "Error description",
        "errors": {}
    }
    ```
    
    For detailed documentation, see the README.md file or visit /api/docs/
    """
    return Response({
        'message': 'Welcome to the Smart College Activity & Resource Portal API',
        'version': '1.0.0',
        'documentation': request.build_absolute_uri('/api/docs/'),
        'endpoints': {
            'authentication': request.build_absolute_uri('/api/auth/'),
            'announcements': request.build_absolute_uri('/api/announcements/'),
            'events': request.build_absolute_uri('/api/events/'),
            'reels': request.build_absolute_uri('/api/reels/'),
            'tickets': request.build_absolute_uri('/api/tickets/'),
            'students': request.build_absolute_uri('/api/students/'),
            'analytics': request.build_absolute_uri('/api/analytics/'),
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_docs(request):
    """
    API Documentation Endpoint
    
    This endpoint provides comprehensive API documentation.
    For the browsable HTML version, visit this URL in a web browser.
    """
    docs = {
        'title': 'Smart College Activity & Resource Portal API',
        'version': '1.0.0',
        'description': 'RESTful API for managing college activities, announcements, events, and student support',
        'base_url': request.build_absolute_uri('/api/'),
        
        'authentication': {
            'type': 'JWT (JSON Web Token)',
            'header': 'Authorization: Bearer <access_token>',
            'token_lifetime': {
                'access': '15 minutes',
                'refresh': '7 days'
            },
            'endpoints': {
                'register': {
                    'method': 'POST',
                    'url': '/api/auth/register',
                    'description': 'Register a new student account',
                    'authentication_required': False,
                    'request_body': {
                        'name': 'string (required)',
                        'email': 'string (required, unique)',
                        'password': 'string (required, min 8 chars)',
                        'student_id': 'string (required, unique)'
                    }
                },
                'login': {
                    'method': 'POST',
                    'url': '/api/auth/login',
                    'description': 'Authenticate and receive JWT tokens',
                    'authentication_required': False,
                    'request_body': {
                        'email': 'string (required)',
                        'password': 'string (required)'
                    }
                },
                'refresh': {
                    'method': 'POST',
                    'url': '/api/auth/token/refresh',
                    'description': 'Refresh access token',
                    'authentication_required': False,
                    'request_body': {
                        'refresh': 'string (required)'
                    }
                }
            }
        },
        
        'announcements': {
            'list': {
                'method': 'GET',
                'url': '/api/announcements',
                'description': 'List all announcements (paginated)',
                'authentication_required': True,
                'query_parameters': {
                    'page': 'integer (optional, default: 1)',
                    'page_size': 'integer (optional, default: 20)'
                }
            },
            'create': {
                'method': 'POST',
                'url': '/api/announcements',
                'description': 'Create a new announcement',
                'authentication_required': True,
                'permissions': 'Admin only',
                'request_body': {
                    'title': 'string (required, max 255 chars)',
                    'content': 'string (required)'
                }
            }
        },
        
        'events': {
            'list': {
                'method': 'GET',
                'url': '/api/events',
                'description': 'List all upcoming events (paginated)',
                'authentication_required': True,
                'query_parameters': {
                    'page': 'integer (optional, default: 1)',
                    'page_size': 'integer (optional, default: 20)'
                }
            },
            'create': {
                'method': 'POST',
                'url': '/api/events',
                'description': 'Create a new event',
                'authentication_required': True,
                'permissions': 'Admin only',
                'request_body': {
                    'title': 'string (required)',
                    'description': 'string (required)',
                    'date': 'date (required, YYYY-MM-DD)',
                    'time': 'time (required, HH:MM:SS)',
                    'location': 'string (required)',
                    'capacity': 'integer (required)'
                }
            },
            'register': {
                'method': 'POST',
                'url': '/api/events/{id}/register',
                'description': 'Register for an event',
                'authentication_required': True,
                'permissions': 'Student only'
            },
            'my_events': {
                'method': 'GET',
                'url': '/api/events/my-events',
                'description': 'Get events the current student is registered for',
                'authentication_required': True,
                'permissions': 'Student only'
            }
        },
        
        'reels': {
            'list': {
                'method': 'GET',
                'url': '/api/reels',
                'description': 'List media feed (paginated)',
                'authentication_required': True,
                'query_parameters': {
                    'page': 'integer (optional, default: 1)',
                    'page_size': 'integer (optional, default: 10)'
                }
            },
            'upload': {
                'method': 'POST',
                'url': '/api/reels',
                'description': 'Upload media content',
                'authentication_required': True,
                'permissions': 'Admin only',
                'content_type': 'multipart/form-data',
                'request_body': {
                    'title': 'string (required)',
                    'description': 'string (optional)',
                    'file': 'file (required, max 50MB)',
                    'file_type': 'string (required, "video" or "image")'
                }
            }
        },
        
        'tickets': {
            'list': {
                'method': 'GET',
                'url': '/api/tickets',
                'description': 'List tickets (students see their own, admins see all)',
                'authentication_required': True
            },
            'create': {
                'method': 'POST',
                'url': '/api/tickets',
                'description': 'Create a support ticket',
                'authentication_required': True,
                'permissions': 'Student only',
                'request_body': {
                    'subject': 'string (required)',
                    'description': 'string (required)',
                    'category': 'string (required, choices: technical, academic, administrative, other)'
                }
            },
            'update': {
                'method': 'PATCH',
                'url': '/api/tickets/{id}',
                'description': 'Update ticket status',
                'authentication_required': True,
                'permissions': 'Admin only',
                'request_body': {
                    'status': 'string (choices: open, in_progress, resolved, closed)'
                }
            }
        },
        
        'students': {
            'list': {
                'method': 'GET',
                'url': '/api/students',
                'description': 'List all students (paginated)',
                'authentication_required': True,
                'permissions': 'Admin only',
                'query_parameters': {
                    'page': 'integer (optional, default: 1)',
                    'page_size': 'integer (optional, default: 50)',
                    'search': 'string (optional, search by name, email, or student_id)'
                }
            }
        },
        
        'analytics': {
            'dashboard': {
                'method': 'GET',
                'url': '/api/analytics/dashboard',
                'description': 'Get overall system statistics',
                'authentication_required': True,
                'permissions': 'Admin only'
            },
            'participation': {
                'method': 'GET',
                'url': '/api/analytics/participation',
                'description': 'Get event participation metrics',
                'authentication_required': True,
                'permissions': 'Admin only',
                'query_parameters': {
                    'start_date': 'date (optional, YYYY-MM-DD)',
                    'end_date': 'date (optional, YYYY-MM-DD)'
                }
            }
        },
        
        'rate_limiting': {
            'anonymous': '100 requests per hour',
            'authenticated': '1000 requests per hour',
            'login_endpoint': '5 requests per minute'
        },
        
        'error_codes': {
            '400': 'Bad Request - Invalid input data',
            '401': 'Unauthorized - Authentication required or invalid token',
            '403': 'Forbidden - Insufficient permissions',
            '404': 'Not Found - Resource does not exist',
            '429': 'Too Many Requests - Rate limit exceeded',
            '500': 'Internal Server Error - Server-side error'
        }
    }
    
    return Response(docs)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/docs/', api_docs, name='api-docs'),
    path('api/auth/', include('authentication.urls')),
    path('api/students/', include('students.urls')),
    path('api/announcements/', include('announcements.urls')),
    path('api/', include('events.urls')),
    path('api/reels/', include('reels.urls')),
    path('api/', include('tickets.urls')),
    path('api/', include('analytics.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
