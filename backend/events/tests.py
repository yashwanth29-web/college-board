from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, time

from authentication.models import User, Student
from .models import Event, EventRegistration


class EventModelTest(TestCase):
    """Test Event model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
        
        self.event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            date=date(2024, 12, 31),
            time=time(10, 0),
            location='Test Location',
            capacity=100,
            current_registrations=0,
            created_by=self.admin_user
        )
    
    def test_event_creation(self):
        """Test event is created correctly"""
        self.assertEqual(self.event.title, 'Test Event')
        self.assertEqual(self.event.capacity, 100)
        self.assertEqual(self.event.current_registrations, 0)
        self.assertTrue(self.event.is_active)
    
    def test_is_full_property(self):
        """Test is_full property"""
        self.assertFalse(self.event.is_full)
        
        self.event.current_registrations = 100
        self.event.save()
        self.assertTrue(self.event.is_full)
    
    def test_event_str_representation(self):
        """Test string representation"""
        expected = f"Test Event - {self.event.date}"
        self.assertEqual(str(self.event), expected)



class EventAPITest(APITestCase):
    """Test Event API endpoints"""
    
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
        
        # Create student user
        self.student_user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='testpass123',
            is_student=True
        )
        
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001'
        )
        
        # Create test event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            date=date(2024, 12, 31),
            time=time(10, 0),
            location='Test Location',
            capacity=2,
            current_registrations=0,
            created_by=self.admin_user
        )
        
        self.client = APIClient()
    
    def test_list_events_authenticated(self):
        """Test listing events requires authentication"""
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_event_admin_only(self):
        """Test only admins can create events"""
        event_data = {
            'title': 'New Event',
            'description': 'New Description',
            'date': '2024-12-31',
            'time': '14:00:00',
            'location': 'New Location',
            'capacity': 50
        }
        
        # Student cannot create
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post('/api/events/', event_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin can create
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/events/', event_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')

    
    def test_register_for_event(self):
        """Test student can register for event"""
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        
        # Verify registration was created
        self.assertTrue(
            EventRegistration.objects.filter(
                student=self.student,
                event=self.event
            ).exists()
        )
        
        # Verify counter was incremented
        self.event.refresh_from_db()
        self.assertEqual(self.event.current_registrations, 1)
    
    def test_cannot_register_twice(self):
        """Test student cannot register for same event twice"""
        self.client.force_authenticate(user=self.student_user)
        
        # First registration
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Second registration should fail
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already registered', response.data['message'])
    
    def test_cannot_register_when_full(self):
        """Test cannot register when event is at capacity"""
        # Fill the event
        self.event.current_registrations = self.event.capacity
        self.event.save()
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.post(f'/api/events/{self.event.id}/register/')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full capacity', response.data['message'])
    
    def test_get_my_events(self):
        """Test student can get their registered events"""
        # Register for event
        EventRegistration.objects.create(
            student=self.student,
            event=self.event
        )
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/events/my-events/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
    
    def test_get_event_registrations_admin_only(self):
        """Test only admins can view event registrations"""
        # Student cannot view
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(f'/api/events/{self.event.id}/registrations/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin can view
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/events/{self.event.id}/registrations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
