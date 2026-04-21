from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from authentication.models import User
from .models import Media


class MediaModelTest(TestCase):
    """Test cases for Media model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
    
    def test_create_media(self):
        """Test creating a media instance"""
        media = Media.objects.create(
            title='Test Video',
            description='Test description',
            file='reels/2024/01/test.mp4',
            file_type='video',
            file_size=1024000,
            created_by=self.user
        )
        self.assertEqual(media.title, 'Test Video')
        self.assertEqual(media.file_type, 'video')
        self.assertEqual(media.views, 0)
        self.assertTrue(media.is_active)
    
    def test_media_ordering(self):
        """Test media is ordered by created_at descending"""
        media1 = Media.objects.create(
            title='First',
            file='reels/2024/01/first.mp4',
            file_type='video',
            file_size=1024,
            created_by=self.user
        )
        media2 = Media.objects.create(
            title='Second',
            file='reels/2024/01/second.mp4',
            file_type='video',
            file_size=1024,
            created_by=self.user
        )
        
        media_list = list(Media.objects.all())
        self.assertEqual(media_list[0].title, 'Second')
        self.assertEqual(media_list[1].title, 'First')


class MediaAPITest(APITestCase):
    """Test cases for Media API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='testpass123',
            is_staff=True
        )
        
        # Create student user
        self.student = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='testpass123',
            is_student=True
        )
        
        # Create test media
        self.media = Media.objects.create(
            title='Test Video',
            description='Test description',
            file='reels/2024/01/test.mp4',
            file_type='video',
            file_size=1024000,
            created_by=self.admin,
            is_active=True
        )
    
    def test_list_media_authenticated(self):
        """Test listing media as authenticated user"""
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/api/reels/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('data', response.data)
    
    def test_list_media_unauthenticated(self):
        """Test listing media without authentication fails"""
        response = self.client.get('/api/reels/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_media_as_admin(self):
        """Test creating media as admin user"""
        self.client.force_authenticate(user=self.admin)
        
        # Create a simple test file
        test_file = SimpleUploadedFile(
            "test_video.mp4",
            b"file_content",
            content_type="video/mp4"
        )
        
        data = {
            'title': 'New Video',
            'description': 'New description',
            'file': test_file,
            'file_type': 'video'
        }
        
        response = self.client.post('/api/reels/', data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['data']['title'], 'New Video')
    
    def test_create_media_as_student_fails(self):
        """Test creating media as student user fails"""
        self.client.force_authenticate(user=self.student)
        
        test_file = SimpleUploadedFile(
            "test_video.mp4",
            b"file_content",
            content_type="video/mp4"
        )
        
        data = {
            'title': 'New Video',
            'file': test_file,
            'file_type': 'video'
        }
        
        response = self.client.post('/api/reels/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_pagination(self):
        """Test pagination with page_size=10"""
        self.client.force_authenticate(user=self.student)
        
        # Create 15 media items
        for i in range(15):
            Media.objects.create(
                title=f'Video {i}',
                file=f'reels/2024/01/video{i}.mp4',
                file_type='video',
                file_size=1024,
                created_by=self.admin,
                is_active=True
            )
        
        response = self.client.get('/api/reels/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']['results']), 10)
        self.assertIsNotNone(response.data['data']['next'])
