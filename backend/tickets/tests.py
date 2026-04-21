from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from authentication.models import User, Student
from .models import Ticket


class TicketModelTest(TestCase):
    """Test Ticket model"""
    
    def setUp(self):
        # Create a student user
        self.user = User.objects.create_user(
            email='student@test.com',
            name='Test Student',
            password='testpass123',
            is_student=True
        )
        self.student = Student.objects.create(
            user=self.user,
            student_id='STU001'
        )
    
    def test_ticket_creation(self):
        """Test creating a ticket"""
        ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='Test description',
            category='technical',
            student=self.student
        )
        self.assertEqual(ticket.subject, 'Test Ticket')
        self.assertEqual(ticket.status, 'open')
        self.assertEqual(str(ticket), f'Ticket #{ticket.id}: Test Ticket')


class TicketAPITest(APITestCase):
    """Test Ticket API endpoints"""
    
    def setUp(self):
        # Create student user
        self.student_user = User.objects.create_user(
            email='student@test.com',
            name='Test Student',
            password='testpass123',
            is_student=True
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001'
        )
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            name='Test Admin',
            password='testpass123',
            is_staff=True
        )
        
        self.client = APIClient()
    
    def test_student_create_ticket(self):
        """Test student can create a ticket"""
        self.client.force_authenticate(user=self.student_user)
        
        data = {
            'subject': 'Login Issue',
            'description': 'Cannot access my account',
            'category': 'technical'
        }
        
        response = self.client.post('/api/tickets/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['data']['subject'], 'Login Issue')
        self.assertEqual(response.data['data']['status'], 'open')
    
    def test_student_list_own_tickets(self):
        """Test student can only see their own tickets"""
        # Create ticket for student
        Ticket.objects.create(
            subject='My Ticket',
            description='Test',
            category='technical',
            student=self.student
        )
        
        # Create another student and ticket
        other_user = User.objects.create_user(
            email='other@test.com',
            name='Other Student',
            password='testpass123',
            is_student=True
        )
        other_student = Student.objects.create(
            user=other_user,
            student_id='STU002'
        )
        Ticket.objects.create(
            subject='Other Ticket',
            description='Test',
            category='academic',
            student=other_student
        )
        
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/tickets/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['subject'], 'My Ticket')
    
    def test_admin_list_all_tickets(self):
        """Test admin can see all tickets"""
        # Create tickets for different students
        Ticket.objects.create(
            subject='Ticket 1',
            description='Test',
            category='technical',
            student=self.student
        )
        
        other_user = User.objects.create_user(
            email='other@test.com',
            name='Other Student',
            password='testpass123',
            is_student=True
        )
        other_student = Student.objects.create(
            user=other_user,
            student_id='STU002'
        )
        Ticket.objects.create(
            subject='Ticket 2',
            description='Test',
            category='academic',
            student=other_student
        )
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/tickets/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 2)
    
    def test_admin_update_ticket(self):
        """Test admin can update ticket status and assignment"""
        ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='Test',
            category='technical',
            student=self.student
        )
        
        self.client.force_authenticate(user=self.admin_user)
        
        data = {
            'status': 'in_progress',
            'assigned_to': self.admin_user.id
        }
        
        response = self.client.patch(f'/api/tickets/{ticket.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], 'in_progress')
        self.assertEqual(response.data['data']['assigned_to']['id'], self.admin_user.id)
    
    def test_student_cannot_update_ticket(self):
        """Test student cannot update ticket status"""
        ticket = Ticket.objects.create(
            subject='Test Ticket',
            description='Test',
            category='technical',
            student=self.student
        )
        
        self.client.force_authenticate(user=self.student_user)
        
        data = {'status': 'resolved'}
        response = self.client.patch(f'/api/tickets/{ticket.id}/', data)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_filter_tickets_by_status(self):
        """Test filtering tickets by status"""
        Ticket.objects.create(
            subject='Open Ticket',
            description='Test',
            category='technical',
            status='open',
            student=self.student
        )
        Ticket.objects.create(
            subject='Resolved Ticket',
            description='Test',
            category='academic',
            status='resolved',
            student=self.student
        )
        
        self.client.force_authenticate(user=self.student_user)
        
        # Filter by open status
        response = self.client.get('/api/tickets/?status=open')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['status'], 'open')
