from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.core.cache import cache
from .serializers import UserSerializer, RegistrationSerializer
from .models import User
from .throttles import LoginRateThrottle


class RegisterView(APIView):
    """
    POST /api/auth/register
    Register a new student account
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Get student profile
            student_profile = {
                'id': user.student_profile.id,
                'student_id': user.student_profile.student_id,
                'enrollment_date': user.student_profile.enrollment_date.isoformat()
            }
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Student registered successfully',
                    'data': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'is_student': user.is_student,
                        'student_profile': student_profile
                    }
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'status': 'error',
                'message': 'Registration failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    POST /api/auth/login
    Authenticate user and return JWT tokens
    Implements account lockout after 5 failed attempts within 15 minutes
    """
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]
    
    def post(self, request):
        email = request.data.get('email', '').lower()
        password = request.data.get('password', '')
        
        if not email or not password:
            return Response(
                {
                    'status': 'error',
                    'message': 'Email and password are required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if account is locked
        lockout_key = f'lockout_{email}'
        attempts_key = f'attempts_{email}'
        
        if cache.get(lockout_key):
            return Response(
                {
                    'status': 'error',
                    'message': 'Account temporarily locked due to too many failed login attempts. Please try again in 15 minutes.'
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Check if user exists and is active before authentication
        try:
            user_obj = User.objects.get(email=email)
            if not user_obj.is_active:
                return Response(
                    {
                        'status': 'error',
                        'message': 'Account is inactive'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            pass  # Will be handled by authenticate below
        
        # Authenticate user
        user = authenticate(request, username=email, password=password)
        
        if user is None:
            # Increment failed attempts
            attempts = cache.get(attempts_key, 0) + 1
            cache.set(attempts_key, attempts, 900)  # 15 minutes
            
            # Lock account after 5 failed attempts
            if attempts >= 5:
                cache.set(lockout_key, True, 900)  # Lock for 15 minutes
                return Response(
                    {
                        'status': 'error',
                        'message': 'Account locked due to too many failed login attempts. Please try again in 15 minutes.'
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            return Response(
                {
                    'status': 'error',
                    'message': 'Invalid credentials'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Clear failed attempts on successful login
        cache.delete(attempts_key)
        cache.delete(lockout_key)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                'status': 'success',
                'data': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'is_student': user.is_student,
                        'is_staff': user.is_staff
                    }
                }
            },
            status=status.HTTP_200_OK
        )


class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/token/refresh
    Refresh access token using refresh token
    """
    permission_classes = [AllowAny]
