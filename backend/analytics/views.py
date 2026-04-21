from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.permissions import IsAdminUser
from authentication.models import Student
from events.models import Event, EventRegistration
from announcements.models import Announcement
from tickets.models import Ticket
from django.db.models import Count, Avg, Q, F
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
from django.utils import timezone


class AnalyticsOverviewView(APIView):
    """
    GET /api/analytics/overview
    Get dashboard overview statistics (Admin only)
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Get total counts
        total_students = Student.objects.count()
        total_events = Event.objects.count()
        total_announcements = Announcement.objects.count()
        total_tickets = Ticket.objects.count()
        
        # Get open tickets count
        open_tickets = Ticket.objects.filter(status='open').count()
        
        # Get active events count (future events)
        active_events = Event.objects.filter(
            is_active=True,
            date__gte=timezone.now().date()
        ).count()
        
        data = {
            'total_students': total_students,
            'total_events': total_events,
            'total_announcements': total_announcements,
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'active_events': active_events
        }
        
        return Response({
            'status': 'success',
            'data': data
        }, status=status.HTTP_200_OK)



class AnalyticsParticipationView(APIView):
    """
    GET /api/analytics/participation
    Get event participation statistics with date range filtering (Admin only)
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Get date range from query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Build query filters
        filters = Q()
        
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                filters &= Q(registered_at__date__gte=start_date_obj)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid start_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                filters &= Q(registered_at__date__lte=end_date_obj)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid end_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get total registrations in the period
        registrations_query = EventRegistration.objects.filter(filters)
        total_registrations = registrations_query.count()
        
        # Get event-wise registration statistics
        events_data = []
        
        # Build filter for registrations related to events
        registration_filters = Q()
        if start_date:
            registration_filters &= Q(registrations__registered_at__date__gte=start_date_obj)
        if end_date:
            registration_filters &= Q(registrations__registered_at__date__lte=end_date_obj)
        
        events = Event.objects.annotate(
            registration_count=Count('registrations', filter=registration_filters)
        ).filter(registration_count__gt=0)
        
        for event in events:
            fill_rate = (event.registration_count / event.capacity * 100) if event.capacity > 0 else 0
            events_data.append({
                'event_id': event.id,
                'event_title': event.title,
                'registrations': event.registration_count,
                'capacity': event.capacity,
                'fill_rate': round(fill_rate, 1)
            })
        
        # Get registrations over time (grouped by date)
        registrations_over_time = registrations_query.annotate(
            date=TruncDate('registered_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Format registrations_over_time
        time_series = [
            {
                'date': item['date'].strftime('%Y-%m-%d'),
                'count': item['count']
            }
            for item in registrations_over_time
        ]
        
        data = {
            'period': {
                'start': start_date if start_date else None,
                'end': end_date if end_date else None
            },
            'total_registrations': total_registrations,
            'events': events_data,
            'registrations_over_time': time_series
        }
        
        return Response({
            'status': 'success',
            'data': data
        }, status=status.HTTP_200_OK)



class AnalyticsTicketsView(APIView):
    """
    GET /api/analytics/tickets
    Get ticket resolution metrics with date range filtering (Admin only)
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Get date range from query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Build query filters
        filters = Q()
        
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                filters &= Q(created_at__date__gte=start_date_obj)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid start_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                filters &= Q(created_at__date__lte=end_date_obj)
            except ValueError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid end_date format. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get tickets in the period
        tickets_query = Ticket.objects.filter(filters)
        total_tickets = tickets_query.count()
        
        # Get status distribution
        status_distribution = {}
        for status_choice, _ in Ticket.STATUS_CHOICES:
            count = tickets_query.filter(status=status_choice).count()
            status_distribution[status_choice] = count
        
        # Get category breakdown
        category_breakdown = {}
        for category_choice, _ in Ticket.CATEGORY_CHOICES:
            count = tickets_query.filter(category=category_choice).count()
            category_breakdown[category_choice] = count
        
        # Calculate average resolution time for resolved tickets
        resolved_tickets = tickets_query.filter(
            status='resolved',
            resolved_at__isnull=False
        ).annotate(
            resolution_time=F('resolved_at') - F('created_at')
        )
        
        # Calculate average in hours
        average_resolution_time_hours = None
        if resolved_tickets.exists():
            total_seconds = sum(
                (ticket.resolved_at - ticket.created_at).total_seconds()
                for ticket in resolved_tickets
            )
            average_seconds = total_seconds / resolved_tickets.count()
            average_resolution_time_hours = round(average_seconds / 3600, 1)
        
        data = {
            'total_tickets': total_tickets,
            'status_distribution': status_distribution,
            'average_resolution_time_hours': average_resolution_time_hours,
            'category_breakdown': category_breakdown
        }
        
        return Response({
            'status': 'success',
            'data': data
        }, status=status.HTTP_200_OK)
