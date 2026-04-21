from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Ticket
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketUpdateSerializer
)
from authentication.permissions import IsAdminUser
from authentication.models import Student


class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Ticket CRUD operations
    - GET /api/tickets - List tickets (role-based filtering)
    - POST /api/tickets - Create ticket (student only)
    - PATCH /api/tickets/{id} - Update ticket status/assignment (admin only)
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter tickets based on user role:
        - Students see only their own tickets
        - Admins see all tickets
        """
        user = self.request.user
        queryset = Ticket.objects.select_related(
            'student__user', 'assigned_to'
        ).order_by('-created_at')
        
        # Apply status filter if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Role-based filtering
        if user.is_staff:
            # Admins see all tickets
            return queryset
        else:
            # Students see only their own tickets
            try:
                student = user.student_profile
                return queryset.filter(student=student)
            except Student.DoesNotExist:
                return Ticket.objects.none()
    
    def get_permissions(self):
        """
        Admin-only actions: update, partial_update, destroy
        Student actions: create
        Both: list, retrieve
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return TicketCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TicketUpdateSerializer
        return TicketSerializer
    
    def list(self, request, *args, **kwargs):
        """GET /api/tickets - List tickets with role-based filtering"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # No pagination for simplicity, but can be added
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'status': 'success',
            'data': {
                'count': queryset.count(),
                'results': serializer.data
            }
        })
    
    def create(self, request, *args, **kwargs):
        """POST /api/tickets - Create a new ticket (student only)"""
        # Check if user is a student
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Only students can create tickets'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return full ticket details
        ticket = serializer.instance
        response_serializer = TicketSerializer(ticket)
        
        return Response({
            'status': 'success',
            'message': 'Ticket created successfully',
            'data': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/tickets/{id} - Update ticket status/assignment (admin only)"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return full ticket details
        response_serializer = TicketSerializer(instance)
        
        return Response({
            'status': 'success',
            'message': 'Ticket updated successfully',
            'data': response_serializer.data
        })
