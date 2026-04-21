from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Announcement

User = get_user_model()


class AnnouncementModelTest(TestCase):
    """Test cases for Announcement model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
    
    def test_create_announcement(self):
        """Test creating an announcement"""
        announcement = Announcement.objects.create(
            title='Test Announcement',
            content='This is a test announcement',
            created_by=self.admin_user
        )
        self.assertEqual(announcement.title, 'Test Announcement')
        self.assertTrue(announcement.is_active)
        self.assertIsNotNone(announcement.published_date)
    
    def test_announcement_str(self):
        """Test announcement string representation"""
        announcement = Announcement.objects.create(
            title='Test Title',
            content='Test Content',
            created_by=self.admin_user
        )
        self.assertEqual(str(announcement), 'Test Title')


class AnnouncementAPITest(APITestCase):
    """Test cases for Announcement API endpoints"""
    
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
        
        # Create student user
        self.student_user = User.objects.create_user(
            email='student@test.com',
            name='Student User',
            password='testpass123',
            is_student=True
        )
        
        # Create test announcement
        self.announcement = Announcement.objects.create(
            title='Test Announcement',
            content='Test Content',
            created_by=self.admin_user
        )
    
    def test_list_announcements_authenticated(self):
        """Test listing announcements as authenticated user"""
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/announcements/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_list_announcements_unauthenticated(self):
        """Test listing announcements without authentication"""
        response = self.client.get('/api/announcements/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_announcement_as_admin(self):
        """Test creating announcement as admin"""
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'title': 'New Announcement',
            'content': 'New Content'
        }
        response = self.client.post('/api/announcements/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Announcement')
    
    def test_create_announcement_as_student(self):
        """Test creating announcement as student (should fail)"""
        self.client.force_authenticate(user=self.student_user)
        data = {
            'title': 'New Announcement',
            'content': 'New Content'
        }
        response = self.client.post('/api/announcements/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_announcement_as_admin(self):
        """Test soft deleting announcement as admin"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/announcements/{self.announcement.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify soft delete
        self.announcement.refresh_from_db()
        self.assertFalse(self.announcement.is_active)
