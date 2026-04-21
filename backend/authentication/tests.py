from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for the custom User model"""
    
    def test_create_user_with_email(self):
        """Test creating a user with email is successful"""
        email = 'test@example.com'
        name = 'Test User'
        password = 'testpass123'
        
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password
        )
        
        self.assertEqual(user.email, email)
        self.assertEqual(user.name, name)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_student)
    
    def test_create_user_email_normalized(self):
        """Test email is normalized for new users"""
        email = 'test@EXAMPLE.COM'
        user = User.objects.create_user(
            email=email,
            name='Test User',
            password='testpass123'
        )
        
        self.assertEqual(user.email, email.lower())
    
    def test_create_user_without_email_raises_error(self):
        """Test creating user without email raises ValueError"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='',
                name='Test User',
                password='testpass123'
            )
    
    def test_create_user_without_name_raises_error(self):
        """Test creating user without name raises ValueError"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='test@example.com',
                name='',
                password='testpass123'
            )
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        email = 'admin@example.com'
        name = 'Admin User'
        password = 'adminpass123'
        
        user = User.objects.create_superuser(
            email=email,
            name=name,
            password=password
        )
        
        self.assertEqual(user.email, email)
        self.assertEqual(user.name, name)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)
    
    def test_create_student_user(self):
        """Test creating a user with is_student flag"""
        email = 'student@example.com'
        name = 'Student User'
        password = 'studentpass123'
        
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            is_student=True
        )
        
        self.assertTrue(user.is_student)
        self.assertFalse(user.is_staff)
    
    def test_user_str_representation(self):
        """Test the string representation of user"""
        email = 'test@example.com'
        user = User.objects.create_user(
            email=email,
            name='Test User',
            password='testpass123'
        )
        
        self.assertEqual(str(user), email)


from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Student


class AuthenticationEndpointsTestCase(APITestCase):
    """Test authentication endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.refresh_url = reverse('authentication:token_refresh')
        
        self.valid_registration_data = {
            'name': 'Test Student',
            'email': 'test@college.edu',
            'password': 'SecurePass123!',
            'student_id': 'STU2024001'
        }
    
    def test_register_student_success(self):
        """Test successful student registration"""
        response = self.client.post(self.register_url, self.valid_registration_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('data', response.data)
        self.assertEqual(response.data['data']['email'], 'test@college.edu')
        self.assertTrue(response.data['data']['is_student'])
        
        # Verify user was created
        self.assertTrue(User.objects.filter(email='test@college.edu').exists())
        
        # Verify student profile was created
        user = User.objects.get(email='test@college.edu')
        self.assertTrue(hasattr(user, 'student_profile'))
        self.assertEqual(user.student_profile.student_id, 'STU2024001')
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        # Create first user
        self.client.post(self.register_url, self.valid_registration_data, format='json')
        
        # Try to register with same email
        response = self.client.post(self.register_url, self.valid_registration_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
    
    def test_register_invalid_password(self):
        """Test registration with weak password"""
        data = self.valid_registration_data.copy()
        data['password'] = '123'  # Too short
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
    
    def test_login_success(self):
        """Test successful login"""
        # Register a user first
        self.client.post(self.register_url, self.valid_registration_data, format='json')
        
        # Login
        login_data = {
            'email': 'test@college.edu',
            'password': 'SecurePass123!'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
        self.assertIn('user', response.data['data'])
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'nonexistent@college.edu',
            'password': 'WrongPassword123!'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['status'], 'error')
    
    def test_token_refresh(self):
        """Test token refresh endpoint"""
        # Register and login
        self.client.post(self.register_url, self.valid_registration_data, format='json')
        login_data = {
            'email': 'test@college.edu',
            'password': 'SecurePass123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['data']['refresh']
        
        # Refresh token
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class StudentModelTest(TestCase):
    """Test cases for the Student model"""
    
    def test_create_student_profile(self):
        """Test creating a student profile"""
        user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='StudentPass123!',
            is_student=True
        )
        
        student = Student.objects.create(
            user=user,
            student_id='STU2024002',
            department='Computer Science',
            year=2
        )
        
        self.assertEqual(student.user, user)
        self.assertEqual(student.student_id, 'STU2024002')
        self.assertEqual(student.department, 'Computer Science')
        self.assertEqual(student.year, 2)
    
    def test_student_str_representation(self):
        """Test the string representation of student"""
        user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='StudentPass123!',
            is_student=True
        )
        
        student = Student.objects.create(
            user=user,
            student_id='STU2024003'
        )
        
        self.assertEqual(str(student), 'Student User (STU2024003)')


class PermissionClassesTestCase(TestCase):
    """Test custom permission classes"""
    
    def setUp(self):
        """Set up test users"""
        self.admin_user = User.objects.create_user(
            email='admin@college.edu',
            name='Admin User',
            password='AdminPass123!',
            is_staff=True
        )
        
        self.student_user = User.objects.create_user(
            email='student@college.edu',
            name='Student User',
            password='StudentPass123!',
            is_student=True
        )
        
        self.student_profile = Student.objects.create(
            user=self.student_user,
            student_id='STU2024004'
        )
    
    def test_admin_user_is_staff(self):
        """Test admin user has staff privileges"""
        self.assertTrue(self.admin_user.is_staff)
        self.assertFalse(self.admin_user.is_student)
    
    def test_student_user_is_student(self):
        """Test student user has student flag"""
        self.assertTrue(self.student_user.is_student)
        self.assertFalse(self.student_user.is_staff)


class SecurityFeaturesTestCase(APITestCase):
    """Test security features: rate limiting and account lockout"""
    
    def setUp(self):
        """Set up test data"""
        self.login_url = reverse('authentication:login')
        self.register_url = reverse('authentication:register')
        
        # Create a test user
        self.user = User.objects.create_user(
            email='test@college.edu',
            name='Test User',
            password='SecurePass123!',
            is_student=True
        )
        
        self.valid_credentials = {
            'email': 'test@college.edu',
            'password': 'SecurePass123!'
        }
        
        self.invalid_credentials = {
            'email': 'test@college.edu',
            'password': 'WrongPassword123!'
        }
    
    def tearDown(self):
        """Clear cache after each test"""
        from django.core.cache import cache
        cache.clear()
    
    def test_account_lockout_after_five_failed_attempts(self):
        """Test account is locked after 5 failed login attempts"""
        from django.core.cache import cache
        cache.clear()  # Clear cache before test
        
        # Make 5 failed login attempts
        for i in range(5):
            response = self.client.post(self.login_url, self.invalid_credentials, format='json')
            if i < 4:
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            else:
                # 5th attempt should lock the account
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
                self.assertIn('locked', response.data['message'].lower())
        
        # Try to login with correct credentials - should still be locked
        response = self.client.post(self.login_url, self.valid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertIn('locked', response.data['message'].lower())
    
    def test_successful_login_clears_failed_attempts(self):
        """Test successful login clears failed attempt counter"""
        from django.core.cache import cache
        cache.clear()  # Clear cache before test
        
        # Make 3 failed attempts
        for i in range(3):
            self.client.post(self.login_url, self.invalid_credentials, format='json')
        
        # Successful login
        response = self.client.post(self.login_url, self.valid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Make 4 more failed attempts - should not lock (counter was reset)
        for i in range(4):
            response = self.client.post(self.login_url, self.invalid_credentials, format='json')
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_requires_email_and_password(self):
        """Test login endpoint validates required fields"""
        from django.core.cache import cache
        cache.clear()  # Clear cache before test
        
        # Missing password
        response = self.client.post(self.login_url, {'email': 'test@college.edu'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing email
        response = self.client.post(self.login_url, {'password': 'SecurePass123!'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_inactive_user_cannot_login(self):
        """Test inactive users cannot login"""
        from django.core.cache import cache
        cache.clear()  # Clear cache before test
        
        # Deactivate user
        self.user.is_active = False
        self.user.save()
        
        response = self.client.post(self.login_url, self.valid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('inactive', response.data['message'].lower())

