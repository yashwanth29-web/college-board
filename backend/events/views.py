from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer
from authentication.permissions import IsAdminUser
from authentication.models import Student


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event CRUD operations
    - GET /api/events - List all events (paginated, ordered by date ascending)
    - POST /api/events - Create event (admin only)
    - POST /api/events/{id}/register - Register for event
    - GET /api/events/my-events - Get student's registered events
    - GET /api/events/{id}/registrations - Get event registrations (admin only)
    """
    queryset = Event.objects.filter(is_active=True).order_by('date', 'time')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin-only actions: create, update, partial_update, destroy, registrations
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'registrations']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """GET /api/events - List all events with pagination"""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })

    def create(self, request, *args, **kwargs):
        """POST /api/events - Create a new event (admin only)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'status': 'success',
            'message': 'Event created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='register')
    def register(self, request, pk=None):
        """POST /api/events/{id}/register - Register current student for event"""
        event = self.get_object()
        
        # Check if user is a student
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Only students can register for events'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if event is full
        if event.is_full:
            return Response({
                'status': 'error',
                'message': 'Event is at full capacity'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already registered
        if EventRegistration.objects.filter(student=student, event=event).exists():
            return Response({
                'status': 'error',
                'message': 'You are already registered for this event'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create registration and increment counter atomically
        with transaction.atomic():
            registration = EventRegistration.objects.create(
                student=student,
                event=event
            )
            event.current_registrations += 1
            event.save(update_fields=['current_registrations'])
        
        serializer = EventRegistrationSerializer(registration)
        return Response({
            'status': 'success',
            'message': 'Successfully registered for event',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-events')
    def my_events(self, request):
        """GET /api/events/my-events - Get events the current student is registered for"""
        # Check if user is a student
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Only students can view their registered events'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get all registrations for this student
        registrations = EventRegistration.objects.filter(
            student=student
        ).select_related('event').order_by('-registered_at')
        
        # Build response with event details and registration info
        events_data = []
        for registration in registrations:
            event_serializer = EventSerializer(registration.event)
            event_data = event_serializer.data
            event_data['registration'] = {
                'id': registration.id,
                'registered_at': registration.registered_at
            }
            events_data.append(event_data)
        
        return Response({
            'status': 'success',
            'data': events_data
        })
    
    @action(detail=True, methods=['get'], url_path='registrations')
    def registrations(self, request, pk=None):
        """GET /api/events/{id}/registrations - Get list of students registered for event (admin only)"""
        event = self.get_object()
        
        registrations = EventRegistration.objects.filter(
            event=event
        ).select_related('student__user').order_by('-registered_at')
        
        serializer = EventRegistrationSerializer(registrations, many=True)
        
        return Response({
            'status': 'success',
            'data': {
                'event': {
                    'id': event.id,
                    'title': event.title,
                    'capacity': event.capacity,
                    'current_registrations': event.current_registrations
                },
                'registrations': serializer.data
            }
        })
