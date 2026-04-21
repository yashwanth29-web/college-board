from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from authentication.models import User, Student


class StudentEndpointsTestCase(APITestCase):
    """Test student management endpoints"""
    
    def setUp(self):
        """Set up test data"""
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='AdminPass123!',
            is_staff=True
        )
        
        # Create student users
        self.student_user1 = User.objects.create_user(
            email='student1@college.edu',
            name='John Doe',
            password='StudentPass123!',
            is_student=True
        )
        self.student_profile1 = Student.objects.create(
            user=self.student_user1,
            student_id='STU2024001',
            department='Computer Science',
            year=2,
            phone='+1234567890'
        )
        
        self.student_user2 = User.objects.create_user(
            email='student2@college.edu',
            name='Jane Smith',
            password='StudentPass123!',
            is_student=True
        )
        self.student_profile2 = Student.objects.create(
            user=self.student_user2,
            student_id='STU2024002',
            department='Information Technology',
            year=3
        )
        
        # URLs
        self.list_url = reverse('students:student-list')
        self.detail_url = lambda id: reverse('students:student-detail', kwargs={'id': id})
        self.deactivate_url = lambda id: reverse('students:student-deactivate', kwargs={'id': id})
    
    def test_get_students_list_as_admin(self):
        """Test admin can retrieve paginated student list"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('data', response.data)
        self.assertEqual(response.data['data']['count'], 2)
        self.assertEqual(len(response.data['data']['results']), 2)
        
        # Check nested user data
        first_student = response.data['data']['results'][0]
        self.assertIn('user', first_student)
        self.assertIn('name', first_student['user'])
        self.assertIn('email', first_student['user'])
    
    def test_get_students_list_as_student_forbidden(self):
        """Test student cannot access student list"""
        self.client.force_authenticate(user=self.student_user1)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_students_list_unauthenticated(self):
        """Test unauthenticated user cannot access student list"""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_search_students_by_name(self):
        """Test searching students by name"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url, {'search': 'John'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['user']['name'], 'John Doe')
    
    def test_search_students_by_email(self):
        """Test searching students by email"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url, {'search': 'student2@'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['user']['email'], 'student2@college.edu')
    
    def test_search_students_by_student_id(self):
        """Test searching students by student ID"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url, {'search': 'STU2024001'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['count'], 1)
        self.assertEqual(response.data['data']['results'][0]['student_id'], 'STU2024001')
    
    def test_update_student_profile_as_admin(self):
        """Test admin can update student profile"""
        self.client.force_authenticate(user=self.admin_user)
        update_data = {
            'department': 'Software Engineering',
            'year': 3,
            'phone': '+9876543210'
        }
        response = self.client.patch(self.detail_url(self.student_profile1.id), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['data']['department'], 'Software Engineering')
        self.assertEqual(response.data['data']['year'], 3)
        self.assertEqual(response.data['data']['phone'], '+9876543210')
        
        # Verify database was updated
        self.student_profile1.refresh_from_db()
        self.assertEqual(self.student_profile1.department, 'Software Engineering')
    
    def test_update_student_profile_partial(self):
        """Test partial update of student profile"""
        self.client.force_authenticate(user=self.admin_user)
        update_data = {'year': 4}
        response = self.client.patch(self.detail_url(self.student_profile1.id), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['year'], 4)
        # Other fields should remain unchanged
        self.assertEqual(response.data['data']['department'], 'Computer Science')
    
    def test_update_student_invalid_year(self):
        """Test updating student with invalid year"""
        self.client.force_authenticate(user=self.admin_user)
        update_data = {'year': 5}  # Invalid year
        response = self.client.patch(self.detail_url(self.student_profile1.id), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
    
    def test_update_student_not_found(self):
        """Test updating non-existent student"""
        self.client.force_authenticate(user=self.admin_user)
        update_data = {'year': 3}
        response = self.client.patch(self.detail_url(9999), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['status'], 'error')
    
    def test_update_student_as_student_forbidden(self):
        """Test student cannot update profiles"""
        self.client.force_authenticate(user=self.student_user1)
        update_data = {'year': 3}
        response = self.client.patch(self.detail_url(self.student_profile1.id), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_deactivate_student_as_admin(self):
        """Test admin can deactivate student account"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.deactivate_url(self.student_profile1.id))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['message'], 'Student account deactivated')
        
        # Verify user is deactivated
        self.student_user1.refresh_from_db()
        self.assertFalse(self.student_user1.is_active)
    
    def test_deactivate_already_inactive_student(self):
        """Test deactivating already inactive student"""
        self.client.force_authenticate(user=self.admin_user)
        
        # Deactivate first time
        self.client.patch(self.deactivate_url(self.student_profile1.id))
        
        # Try to deactivate again
        response = self.client.patch(self.deactivate_url(self.student_profile1.id))
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn('already deactivated', response.data['message'])
    
    def test_deactivate_student_not_found(self):
        """Test deactivating non-existent student"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.deactivate_url(9999))
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['status'], 'error')
    
    def test_deactivate_student_as_student_forbidden(self):
        """Test student cannot deactivate accounts"""
        self.client.force_authenticate(user=self.student_user1)
        response = self.client.patch(self.deactivate_url(self.student_profile2.id))
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_pagination_parameters(self):
        """Test pagination with custom page size"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url, {'page_size': 1})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']['results']), 1)
        self.assertIsNotNone(response.data['data']['next'])
    
    def test_student_serializer_read_only_fields(self):
        """Test that read-only fields cannot be updated"""
        self.client.force_authenticate(user=self.admin_user)
        update_data = {
            'student_id': 'NEWID123',  # Should be read-only
            'enrollment_date': '2025-01-01',  # Should be read-only
            'year': 3
        }
        response = self.client.patch(self.detail_url(self.student_profile1.id), update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify read-only fields were not changed
        self.student_profile1.refresh_from_db()
        self.assertEqual(self.student_profile1.student_id, 'STU2024001')
        # But year should be updated
        self.assertEqual(self.student_profile1.year, 3)

