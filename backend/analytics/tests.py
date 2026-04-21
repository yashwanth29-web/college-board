from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import User, Student
from events.models import Event, EventRegistration
from announcements.models import Announcement
from tickets.models import Ticket
from datetime import datetime, timedelta
from django.utils import timezone


class AnalyticsOverviewTests(TestCase):
    """Tests for analytics overview endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='adminpass123',
            is_staff=True
        )
        
        # Create student user
        self.student_user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='studentpass123',
            is_student=True
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001'
        )
        
        # Create test data
        Event.objects.create(
            title='Test Event',
            description='Test',
            date=timezone.now().date() + timedelta(days=1),
            time='10:00:00',
            location='Test Location',
            capacity=100,
            created_by=self.admin_user
        )
        
        Announcement.objects.create(
            title='Test Announcement',
            content='Test content',
            created_by=self.admin_user
        )
        
        Ticket.objects.create(
            subject='Test Ticket',
            description='Test description',
            category='technical',
            student=self.student
        )
    
    def test_overview_requires_admin(self):
        """Test that overview endpoint requires admin authentication"""
        url = reverse('analytics-overview')
        
        # Unauthenticated request
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        
        # Student request
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_overview_success(self):
        """Test successful overview retrieval"""
        url = reverse('analytics-overview')
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        data = response.data['data']
        self.assertEqual(data['total_students'], 1)
        self.assertEqual(data['total_events'], 1)
        self.assertEqual(data['total_announcements'], 1)
        self.assertEqual(data['total_tickets'], 1)
        self.assertEqual(data['open_tickets'], 1)
        self.assertEqual(data['active_events'], 1)


class AnalyticsParticipationTests(TestCase):
    """Tests for analytics participation endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='adminpass123',
            is_staff=True
        )
        
        # Create student
        self.student_user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='studentpass123',
            is_student=True
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001'
        )
        
        # Create event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test',
            date=timezone.now().date() + timedelta(days=1),
            time='10:00:00',
            location='Test Location',
            capacity=100,
            created_by=self.admin_user
        )
        
        # Create registration
        EventRegistration.objects.create(
            student=self.student,
            event=self.event
        )
    
    def test_participation_requires_admin(self):
        """Test that participation endpoint requires admin authentication"""
        url = reverse('analytics-participation')
        
        # Unauthenticated request
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Student request
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_participation_success(self):
        """Test successful participation retrieval"""
        url = reverse('analytics-participation')
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        data = response.data['data']
        self.assertEqual(data['total_registrations'], 1)
        self.assertEqual(len(data['events']), 1)
        self.assertEqual(data['events'][0]['event_title'], 'Test Event')
        self.assertEqual(data['events'][0]['registrations'], 1)
    
    def test_participation_date_filtering(self):
        """Test date range filtering"""
        url = reverse('analytics-participation')
        self.client.force_authenticate(user=self.admin_user)
        
        # Filter with future date range (should return 0)
        future_date = (timezone.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        response = self.client.get(url, {
            'start_date': future_date,
            'end_date': future_date
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['total_registrations'], 0)
    
    def test_participation_invalid_date_format(self):
        """Test invalid date format handling"""
        url = reverse('analytics-participation')
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(url, {'start_date': 'invalid-date'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')


class AnalyticsTicketsTests(TestCase):
    """Tests for analytics tickets endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='adminpass123',
            is_staff=True
        )
        
        # Create student
        self.student_user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='studentpass123',
            is_student=True
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001'
        )
        
        # Create tickets
        Ticket.objects.create(
            subject='Open Ticket',
            description='Test',
            category='technical',
            status='open',
            student=self.student
        )
        
        # Create resolved ticket with resolution time
        resolved_ticket = Ticket.objects.create(
            subject='Resolved Ticket',
            description='Test',
            category='academic',
            status='resolved',
            student=self.student
        )
        resolved_ticket.resolved_at = resolved_ticket.created_at + timedelta(hours=24)
        resolved_ticket.save()
    
    def test_tickets_requires_admin(self):
        """Test that tickets endpoint requires admin authentication"""
        url = reverse('analytics-tickets')
        
        # Unauthenticated request
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Student request
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_tickets_success(self):
        """Test successful tickets analytics retrieval"""
        url = reverse('analytics-tickets')
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        data = response.data['data']
        self.assertEqual(data['total_tickets'], 2)
        self.assertEqual(data['status_distribution']['open'], 1)
        self.assertEqual(data['status_distribution']['resolved'], 1)
        self.assertIsNotNone(data['average_resolution_time_hours'])
        self.assertGreater(data['average_resolution_time_hours'], 0)
    
    def test_tickets_date_filtering(self):
        """Test date range filtering"""
        url = reverse('analytics-tickets')
        self.client.force_authenticate(user=self.admin_user)
        
        # Filter with future date range (should return 0)
        future_date = (timezone.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        response = self.client.get(url, {
            'start_date': future_date,
            'end_date': future_date
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['total_tickets'], 0)
    
    def test_tickets_invalid_date_format(self):
        """Test invalid date format handling"""
        url = reverse('analytics-tickets')
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(url, {'end_date': 'invalid-date'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
